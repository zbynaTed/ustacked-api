const _ = require("lodash");

function tradeHistory(tradesInput, corporateActionsInput) {
  if (tradesInput.length === 0) return;

  let trades = _.orderBy(tradesInput, ["tradeDate"], ["asc"]);
  corporateActionsInput = _.groupBy(corporateActionsInput, "stockId");

  const { stockId } = trades[0];
  let stockCorporateActions = corporateActionsInput[stockId];
  stockCorporateActions = _.orderBy(
    stockCorporateActions,
    ["effectiveDate" || "recordDate"],
    ["asc"]
  );

  function calculateBalance(previousTrade, currentTrade) {
    if (!previousTrade)
      return currentTrade.buy ? currentTrade.quantity : -currentTrade.quantity;
    return currentTrade.buy
      ? previousTrade.balance + currentTrade.quantity
      : previousTrade.balance - currentTrade.quantity;
  }

  function assessPositionType(previousTrade, currentTrade) {
    if (!previousTrade) return currentTrade.buy;
    if (previousTrade.positionStatus === 4) return currentTrade.buy;
    return previousTrade.longPosition;
  }

  function assessPositionStatus(previousTrade, currentTrade) {
    if (!previousTrade) return 1;
    if (previousTrade.positionStatus === 4) return 1;
    if (previousTrade.longPosition && !currentTrade.buy) {
      if (
        previousTrade.balanceAdjusted ===
        (currentTrade.quantity * currentTrade.totalNumerator) /
          currentTrade.totalDenominator
      ) {
        return 4;
      } else if (
        previousTrade.balanceAdjusted >
        (currentTrade.quantity * currentTrade.totalNumerator) /
          currentTrade.totalDenominator
      ) {
        return 3;
      }
    }
    if (!previousTrade.longPosition && currentTrade.buy) {
      if (previousTrade.balanceAdjusted === currentTrade.quantity) {
        return 4;
      } else if (previousTrade.balanceAdjusted < currentTrade.quantity) {
        return 3;
      }
    }
    return 2;
  }

  function calculateTotalAmountBuy(previousTrade, currentTrade) {
    if (currentTrade.positionStatus === 1)
      return currentTrade.quantityAdjusted * currentTrade.priceAdjusted;
    if (currentTrade.positionStatus === 3 || currentTrade.positionStatus === 4)
      return previousTrade.totalBuyAmount;
    return (
      previousTrade.totalBuyAmount +
      currentTrade.quantityAdjusted * currentTrade.priceAdjusted
    );
  }

  function calculateAverageBuy(previousTrade, currentTrade) {
    if (currentTrade.positionStatus === 1)
      return currentTrade.totalBuyAmount / currentTrade.quantityAdjusted;
    if (currentTrade.positionStatus === 3 || currentTrade.positionStatus === 4)
      return previousTrade.averageBuy;
    return (
      (previousTrade.averageBuy * previousTrade.balanceAdjusted +
        currentTrade.priceAdjusted * currentTrade.quantityAdjusted) /
      currentTrade.balanceAdjusted
    );
  }

  function calculateAccruedTradeCount(previousTrade, currentTrade) {
    if (currentTrade.positionStatus === 1) return 1;
    if (currentTrade.positionStatus === 4) return 0;
    if (currentTrade.positionStatus === 2)
      return previousTrade.accruedTradeCount + 1;
    return previousTrade.accruedTradeCount;
  }

  function calculateAccruedFees(previousTrade, currentTrade) {
    if (currentTrade.positionStatus === 1) return currentTrade.fee;
    if (currentTrade.positionStatus === 4) return 0;
    return previousTrade.accruedFees + currentTrade.fee;
  }

  function calculateRealizedGain(previousTrade, currentTrade) {
    if (!previousTrade) return 0;
    if (
      currentTrade.positionStatus === 3 ||
      currentTrade.positionStatus === 4
    ) {
      if (currentTrade.longPosition) {
        return (
          previousTrade.realizedGain +
          (currentTrade.priceAdjusted - currentTrade.averageBuy) *
            currentTrade.quantityAdjusted
        );
      } else {
        return (
          previousTrade.realizedGain +
          (currentTrade.priceAdjusted - currentTrade.averageSell) *
            currentTrade.quantityAdjusted
        );
      }
    }
    return previousTrade.realizedGain;
  }

  function calculateRealizedFees(previousTrade, currentTrade) {
    if (!previousTrade) return 0;
    if (currentTrade.positionStatus === 4) {
      return previousTrade.accruedFees + currentTrade.fee;
    }
    return previousTrade.realizedFees;
  }

  function calculateBalanceAdjusted(previousTrade, currentTrade) {
    if (!previousTrade)
      return currentTrade.buy
        ? (currentTrade.quantity * currentTrade.totalNumerator) /
            currentTrade.totalDenominator
        : -(currentTrade.quantity * currentTrade.totalNumerator) /
            currentTrade.totalDenominator;
    if (currentTrade.positionStatus === 4) return 0;
    return currentTrade.buy
      ? previousTrade.balanceAdjusted +
          (currentTrade.quantity * currentTrade.totalNumerator) /
            currentTrade.totalDenominator
      : previousTrade.balanceAdjusted -
          (currentTrade.quantity * currentTrade.totalNumerator) /
            currentTrade.totalDenominator;
  }

  function calculateDividends(previousTrade, currentTrade) {
    if (!previousTrade) {
      return (
        ((currentTrade.dividendTotal * currentTrade.balanceAdjusted) /
          currentTrade.totalNumerator) *
        currentTrade.totalDenominator
      );
    }

    return (
      currentTrade.dividendTotal *
      (((currentTrade.balanceAdjusted - previousTrade.balanceAdjusted) /
        currentTrade.totalNumerator) *
        currentTrade.totalDenominator)
    );
  }

  const tradeHistory = [];

  for (let t = 0; t < trades.length; t++) {
    const previousTrade = trades[t - 1] || null;
    const trade = trades[t];
    trade.fee = Number(trade.fee);
    trade.totalNumerator = 1;
    trade.totalDenominator = 1;
    trade.dividendTotal = 0;
    trade.corporateActions = [];
    trade.balance = calculateBalance(previousTrade, trade);

    tradeHistory.push(trade);
  }

  if (stockCorporateActions.length !== 0) {
    for (let ca of stockCorporateActions) {
      const caDate = ca.effectiveDate;

      for (let t in tradeHistory) {
        let trade = tradeHistory[t];
        if (trade.tradeDate < caDate && trade.positionStatus !== 4) {
          trade.corporateActions.push(ca);
        }
      }
    }
  }

  for (let t in tradeHistory) {
    const trade = tradeHistory[t];
    const previousTrade = tradeHistory[t - 1] || null;

    if (trade.corporateActions.length > 0) {
      const caList = trade.corporateActions;
      let tempNumerator = 1;
      let tempDenominator = 1;

      for (let ca of caList) {
        if (ca.caId === 1) {
          tempNumerator = tempNumerator * ca.numerator;
          tempDenominator = tempDenominator * ca.denominator;
        }

        trade.totalNumerator = ca.numerator
          ? trade.totalNumerator * ca.numerator
          : trade.totalNumerator;

        trade.totalDenominator = ca.denominator
          ? trade.totalDenominator * ca.denominator
          : trade.totalDenominator;

        trade.dividendTotal = ca.amount
          ? trade.dividendTotal +
            (parseFloat(ca.amount) * tempNumerator) / tempDenominator
          : trade.dividendTotal;

        trade.quantityAdjusted =
          (trade.quantity * trade.totalNumerator) / trade.totalDenominator;
        trade.priceAdjusted =
          (trade.price * trade.totalDenominator) / trade.totalNumerator;
      }
    }
    trade.balanceAdjusted = calculateBalanceAdjusted(previousTrade, trade);
    trade.longPosition = assessPositionType(previousTrade, trade);
    trade.positionStatus = assessPositionStatus(previousTrade, trade);
  }

  for (let t in tradeHistory) {
    const trade = tradeHistory[t];
    const remainingTrades = [];

    for (let i = Number(t) + 1; i < tradeHistory.length; i++) {
      remainingTrades.push(tradeHistory[i]);
    }
    trade.remainingTrades = remainingTrades;

    trade.remainingBalance = trade.balanceAdjusted;

    if (trade.balanceAdjusted !== 0) {
      for (let r of remainingTrades) {
        if (r.buy)
          trade.remainingBalance +=
            (r.quantity * r.totalNumerator) / r.totalDenominator;
        else
          trade.remainingBalance -=
            (r.quantity * r.totalNumerator) / r.totalDenominator;

        if (trade.longPosition && trade.remainingBalance <= 0) {
          trade.squared = r.tradeDate;
          break;
        }
        if (!trade.longPosition && trade.remainingBalance >= 0) {
          trade.squared = r.tradeDate;
          break;
        }
      }
    }
    trade.remainingTrades = null;
  }

  for (let t in tradeHistory) {
    let currentTrade = tradeHistory[t];
    const previousTrade = t > 0 ? tradeHistory[t - 1] : null;

    const previousTotalDividends =
      previousTrade && previousTrade.totalDividends;

    currentTrade.quantityAdjusted = currentTrade.quantityAdjusted
      ? currentTrade.quantityAdjusted
      : currentTrade.quantity;

    currentTrade.priceAdjusted = currentTrade.priceAdjusted
      ? currentTrade.priceAdjusted
      : currentTrade.price;

    currentTrade.totalBuyAmount = calculateTotalAmountBuy(
      previousTrade,
      currentTrade
    );

    currentTrade.accruedTradeCount = calculateAccruedTradeCount(
      previousTrade,
      currentTrade
    );

    currentTrade.accruedFees = calculateAccruedFees(
      previousTrade,
      currentTrade
    );

    currentTrade.realizedFees = calculateRealizedFees(
      previousTrade,
      currentTrade
    );

    currentTrade.sumDividendTotal = calculateDividends(
      previousTrade,
      currentTrade
    );

    currentTrade.totalDividends =
      previousTotalDividends + currentTrade.sumDividendTotal;

    currentTrade.positionStatus = assessPositionStatus(
      previousTrade,
      currentTrade
    );

    currentTrade.averageBuy = calculateAverageBuy(previousTrade, currentTrade);

    currentTrade.realizedGain = calculateRealizedGain(
      previousTrade,
      currentTrade
    );

    if (currentTrade.squared) {
      const cas = currentTrade.corporateActions;
      for (let c = 0; c <= cas.length - 1; c++) {
        if (cas[c].caId === 3 && cas[c].effectiveDate > currentTrade.squared) {
          cas.splice(c, 1);
          c--;
        }
      }
      currentTrade.corporateActions = cas;
    }
    if (currentTrade.positionStatus === 4) {
      currentTrade.corporateActions = [];
    }
  }

  return {
    lastTrade: {
      [tradeHistory[0].stockId]: tradeHistory[tradeHistory.length - 1],
    },
    allTrades: { [tradeHistory[0].stockId]: tradeHistory },
  };
}

module.exports = tradeHistory;
