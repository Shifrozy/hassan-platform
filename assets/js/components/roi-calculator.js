/**
 * ============================================================================
 * Interactive Strategy ROI & Risk Simulator Widget
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initRoiCalculator();
});

function initRoiCalculator() {
  const calcContainer = document.querySelector('#trading-roi-calculator');
  if (!calcContainer) return;

  const capitalInput = document.getElementById('calc-capital');
  const winrateInput = document.getElementById('calc-winrate');
  const rrInput = document.getElementById('calc-rr');
  const tradesInput = document.getElementById('calc-trades');

  const capitalDisplay = document.getElementById('val-capital');
  const winrateDisplay = document.getElementById('val-winrate');
  const rrDisplay = document.getElementById('val-rr');
  const tradesDisplay = document.getElementById('val-trades');

  const projectedProfitEl = document.getElementById('res-projected-profit');
  const finalBalanceEl = document.getElementById('res-final-balance');
  const profitFactorEl = document.getElementById('res-profit-factor');
  const expectancyEl = document.getElementById('res-expectancy');

  if (!capitalInput || !winrateInput || !rrInput || !tradesInput) return;

  function calculate() {
    const capital = parseFloat(capitalInput.value) || 10000;
    const winrate = parseFloat(winrateInput.value) / 100; // e.g. 0.65
    const rr = parseFloat(rrInput.value); // e.g. 2.0
    const trades = parseInt(tradesInput.value, 10) || 50;

    // Display formatted input values
    capitalDisplay.textContent = `$${capital.toLocaleString()}`;
    winrateDisplay.textContent = `${(winrate * 100).toFixed(0)}%`;
    rrDisplay.textContent = `1 : ${rr.toFixed(1)}`;
    tradesDisplay.textContent = `${trades} trades/mo`;

    // Mathematical Expectancy Calculations
    // Assumes 1.0% risk per trade model
    const riskPerTrade = capital * 0.01;
    const winAmount = riskPerTrade * rr;
    const lossAmount = riskPerTrade;

    const winningTrades = trades * winrate;
    const losingTrades = trades * (1 - winrate);

    const totalGrossProfit = winningTrades * winAmount;
    const totalGrossLoss = losingTrades * lossAmount;
    const netProfit = totalGrossProfit - totalGrossLoss;
    const finalBalance = capital + netProfit;

    const profitFactor = totalGrossLoss > 0 ? (totalGrossProfit / totalGrossLoss).toFixed(2) : '9.99';
    const expectancy = ((winrate * rr) - (1 - winrate)).toFixed(2);

    // Update UI
    if (projectedProfitEl) {
      projectedProfitEl.textContent = `${netProfit >= 0 ? '+' : ''}$${Math.round(netProfit).toLocaleString()}`;
      projectedProfitEl.style.color = netProfit >= 0 ? 'var(--accent-green)' : 'var(--accent-rose)';
    }

    if (finalBalanceEl) {
      finalBalanceEl.textContent = `$${Math.round(finalBalance).toLocaleString()}`;
    }

    if (profitFactorEl) {
      profitFactorEl.textContent = `${profitFactor}`;
    }

    if (expectancyEl) {
      expectancyEl.textContent = `${expectancy}R per trade`;
    }
  }

  capitalInput.addEventListener('input', calculate);
  winrateInput.addEventListener('input', calculate);
  rrInput.addEventListener('input', calculate);
  tradesInput.addEventListener('input', calculate);

  // Initial calculation
  calculate();
}
