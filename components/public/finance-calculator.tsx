"use client";

import { useMemo, useState } from "react";
import { SiteContent } from "@/lib/types";
import { formatCurrencyVnd } from "@/lib/site-utils";

interface FinanceCalculatorProps {
  content: SiteContent["finance"];
}

export function FinanceCalculator({ content }: FinanceCalculatorProps) {
  const [kwp, setKwp] = useState(content.defaults.kwp);
  const [roi, setRoi] = useState(content.defaults.roi);
  const [price, setPrice] = useState(content.defaults.pricePerKwp);

  const summary = useMemo(() => {
    const amount = kwp * price;
    const profit = amount * (roi / 100);
    return {
      amount,
      profit
    };
  }, [kwp, roi, price]);

  return (
    <>
      <form className="calc" id="roiForm">
        <label htmlFor="kwpRange">{content.kwpLabel}</label>
        <div className="range-line">
          <input
            id="kwpRange"
            type="range"
            min={100}
            max={500}
            step={50}
            value={kwp}
            onChange={(event) => setKwp(Number(event.target.value))}
          />
          <output id="kwpOut">{kwp}kWp</output>
        </div>
        <label htmlFor="roiRange">{content.roiLabel}</label>
        <div className="range-line">
          <input
            id="roiRange"
            type="range"
            min={1.8}
            max={2}
            step={0.1}
            value={roi}
            onChange={(event) => setRoi(Number(event.target.value))}
          />
          <output id="roiOut">{roi.toFixed(1)}%</output>
        </div>
        <label htmlFor="priceInput">{content.priceLabel}</label>
        <div className="input-line">
          <input
            id="priceInput"
            type="number"
            min={8000000}
            step={100000}
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
          />
          <span>VND</span>
        </div>
        <p className="form-hint">{content.hint}</p>
      </form>

      <div className="cash-card">
        <div className="cash-head">
          <span>{content.cash.eyebrow}</span>
          <strong>{formatCurrencyVnd(summary.amount)} VND</strong>
        </div>
        <div className="cash-grid">
          <div>
            <span>Lợi nhuận tháng</span>
            <strong>{formatCurrencyVnd(summary.profit)}</strong>
          </div>
          <div>
            <span>Phân bổ NĐT</span>
            <strong>{content.cash.investorShare}</strong>
          </div>
          <div>
            <span>Vận hành/O&amp;M</span>
            <strong>{content.cash.operationsShare}</strong>
          </div>
          <div>
            <span>Lịch chi trả</span>
            <strong>{content.cash.payoutSchedule}</strong>
          </div>
        </div>
        <div className="payment-list" aria-label="Lịch sử thanh toán mẫu">
          {content.payments.map((item) => (
            <div key={`${item.month}-${item.status}`}>
              <span>{item.month}</span>
              <strong>{item.status}</strong>
              <em>{item.amount}</em>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
