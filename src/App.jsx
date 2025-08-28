"use client"

import { useState } from "react"
import "./App.css"

function App() {
  // Form state
  const [merchant, setMerchant] = useState("")
  const [category, setCategory] = useState("Food")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Credit Card")
  const [search, setSearch] = useState("")

  const [activeTab, setActiveTab] = useState("transactions")
  const [nlQuery, setNlQuery] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  // Local transactions (frontend only for now)
  const [transactions, setTransactions] = useState([])

  const categories = ["Food", "Shopping", "Transport", "Bills", "Entertainment", "Other"]
  const paymentMethods = ["Credit Card", "Debit Card", "Cash", "Bank Transfer"]

  const predictions = [
    { month: "Jan", actual: 2400, predicted: 2200 },
    { month: "Feb", actual: 1398, predicted: 1500 },
    { month: "Mar", actual: 9800, predicted: 9000 },
    { month: "Apr", actual: 3908, predicted: 4200 },
    { month: "May", actual: 4800, predicted: 4500 },
    { month: "Jun", actual: 3800, predicted: 4000 },
  ]

  const anomalies = [
    {
      id: 1,
      merchant: "Luxury Store XYZ",
      amount: 2500,
      category: "Shopping",
      severity: "high",
      reason: "Unusually high spending for Shopping category",
    },
    {
      id: 2,
      merchant: "Gas Station",
      amount: 150,
      category: "Transport",
      severity: "medium",
      reason: "Higher than typical fuel expense",
    },
  ]

  const formatCurrency = (n) => Number(n || 0).toLocaleString(undefined, { style: "currency", currency: "USD" })

  const total = transactions.reduce((s, t) => s + (Number(t.amount) || 0), 0)
  const filtered = transactions.filter((t) =>
    `${t.merchant} ${t.category} ${t.paymentMethod}`.toLowerCase().includes(search.toLowerCase()),
  )

  const categorySpending = categories
    .map((cat) => ({
      name: cat,
      value: transactions.filter((t) => t.category === cat).reduce((sum, t) => sum + Number(t.amount), 0),
    }))
    .filter((item) => item.value > 0)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!merchant || !amount) return
    const newTx = {
      id: Date.now(),
      merchant,
      category,
      amount: Number(amount),
      date: date || new Date().toISOString().slice(0, 10),
      paymentMethod,
    }
    setTransactions((prev) => [newTx, ...prev])
    // reset form
    setMerchant("")
    setCategory("Food")
    setAmount("")
    setDate("")
    setPaymentMethod("Credit Card")
  }

  const handleNLQuery = (e) => {
    e.preventDefault()
    if (!nlQuery.trim()) return

    const newMessage = { type: "user", content: nlQuery }
    const mockResponse = {
      type: "ai",
      content: `Based on your query "${nlQuery}", here's what I found: Your average spending in the Food category is ${formatCurrency(categorySpending.find((c) => c.name === "Food")?.value || 0)}. This analysis will be powered by your FastAPI backend with LangChain integration.`,
    }

    setChatHistory((prev) => [...prev, newMessage, mockResponse])
    setNlQuery("")
  }

  // Reusable styles (keeping your existing glassmorphism design)
  const page = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    minHeight: "100vh",
    padding: "2rem",
    color: "white",
  }
  const container = {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gap: "1.5rem",
  }
  const glass = {
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    borderRadius: 16,
    padding: "1.25rem",
    backdropFilter: "blur(10px)",
  }
  const heading = {
    fontSize: "2.25rem",
    fontWeight: 800,
    textAlign: "center",
    textShadow: "2px 2px 4px rgba(0,0,0,0.25)",
    marginBottom: "0.5rem",
  }
  const sub = {
    textAlign: "center",
    opacity: 0.9,
    marginBottom: "1rem",
  }
  const label = { fontSize: 12, opacity: 0.9, marginBottom: 6 }
  const input = {
    width: "100%",
    padding: "0.75rem 0.9rem",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.25)",
    outline: "none",
    background: "rgba(255,255,255,0.9)",
    color: "#1f2937",
    fontSize: 14,
  }
  const button = {
    padding: "0.8rem 1.1rem",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #34d399, #10b981)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(16,185,129,0.35)",
  }
  const stat = {
    ...glass,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }

  const tabButton = (isActive) => ({
    padding: "0.5rem 1rem",
    borderRadius: 8,
    border: "none",
    background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
    color: "white",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: isActive ? 700 : 400,
  })

  return (
    <div style={page}>
      <div style={container}>
        <div>
          <h1 style={heading}>Financial Spending Dashboard</h1>
          <p style={sub}>Advanced analytics, ML predictions, and AI-powered insights</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
          <div style={stat}>
            <div>
              <div style={{ opacity: 0.85 }}>Total Spend</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>{formatCurrency(total)}</div>
            </div>
            <div style={{ opacity: 0.85 }}>{transactions.length} items</div>
          </div>
          <div style={stat}>
            <div>
              <div style={{ opacity: 0.85 }}>Average</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>
                {formatCurrency(transactions.length ? total / transactions.length : 0)}
              </div>
            </div>
            <div style={{ opacity: 0.85 }}>Per transaction</div>
          </div>
          <div style={stat}>
            <div>
              <div style={{ opacity: 0.85 }}>Categories</div>
              <div style={{ fontSize: 26, fontWeight: 800 }}>{categorySpending.length}</div>
            </div>
            <div style={{ opacity: 0.85 }}>Active</div>
          </div>
        </div>

        <div style={glass}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <button style={tabButton(activeTab === "transactions")} onClick={() => setActiveTab("transactions")}>
              Transactions
            </button>
            <button style={tabButton(activeTab === "analytics")} onClick={() => setActiveTab("analytics")}>
              Analytics
            </button>
            <button style={tabButton(activeTab === "predictions")} onClick={() => setActiveTab("predictions")}>
              ML Predictions
            </button>
            <button style={tabButton(activeTab === "anomalies")} onClick={() => setActiveTab("anomalies")}>
              Anomalies
            </button>
            <button style={tabButton(activeTab === "ai-chat")} onClick={() => setActiveTab("ai-chat")}>
              AI Chat
            </button>
          </div>

          {activeTab === "transactions" && (
            <div>
              {/* Add Transaction Form */}
              <form onSubmit={handleAdd} style={{ marginBottom: "1.5rem" }}>
                <div style={{ marginBottom: 12, fontWeight: 700, fontSize: 16 }}>Quick Add Transaction</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                  <div>
                    <div style={label}>Merchant</div>
                    <input
                      style={input}
                      placeholder="e.g., Starbucks"
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                    />
                  </div>
                  <div>
                    <div style={label}>Category</div>
                    <select style={input} value={category} onChange={(e) => setCategory(e.target.value)}>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div style={label}>Amount</div>
                    <input
                      type="number"
                      step="0.01"
                      style={input}
                      placeholder="e.g., 12.99"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <div style={label}>Date</div>
                    <input type="date" style={input} value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div>
                    <div style={label}>Payment Method</div>
                    <select style={input} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      {paymentMethods.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    <button type="submit" style={button}>
                      Add Transaction
                    </button>
                  </div>
                </div>
              </form>

              {/* Search */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={label}>Search</div>
                <input
                  style={input}
                  placeholder="Search by merchant, category, or payment method..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Transaction List */}
              <div>
                <div style={{ marginBottom: 8, fontWeight: 700 }}>Transactions</div>
                {filtered.length === 0 ? (
                  <div style={{ opacity: 0.85 }}>No transactions yet. Add one above.</div>
                ) : (
                  <div style={{ display: "grid", gap: 8 }}>
                    {filtered.map((tx) => (
                      <div
                        key={tx.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.5fr 1fr 0.8fr 1fr 1fr",
                          gap: 8,
                          alignItems: "center",
                          background: "rgba(255,255,255,0.9)",
                          color: "#111827",
                          borderRadius: 10,
                          padding: "0.75rem 0.9rem",
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>{tx.merchant}</div>
                        <div style={{ opacity: 0.8 }}>{tx.category}</div>
                        <div style={{ fontWeight: 700 }}>{formatCurrency(tx.amount)}</div>
                        <div style={{ opacity: 0.8 }}>{tx.date}</div>
                        <div style={{ opacity: 0.8 }}>{tx.paymentMethod}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div>
              <div style={{ marginBottom: 16, fontWeight: 700, fontSize: 16 }}>Spending Analytics</div>
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}
              >
                {/* Category Breakdown */}
                <div
                  style={{ background: "rgba(255,255,255,0.9)", borderRadius: 12, padding: "1rem", color: "#111827" }}
                >
                  <h3 style={{ margin: "0 0 1rem 0", fontSize: 16, fontWeight: 700 }}>Spending by Category</h3>
                  {categorySpending.length > 0 ? (
                    <div style={{ display: "grid", gap: 8 }}>
                      {categorySpending.map((item) => (
                        <div
                          key={item.name}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                        >
                          <span style={{ fontSize: 14 }}>{item.name}</span>
                          <span style={{ fontWeight: 700 }}>{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ opacity: 0.7 }}>No data available. Add transactions to see analytics.</div>
                  )}
                </div>

                {/* Monthly Trends */}
                <div
                  style={{ background: "rgba(255,255,255,0.9)", borderRadius: 12, padding: "1rem", color: "#111827" }}
                >
                  <h3 style={{ margin: "0 0 1rem 0", fontSize: 16, fontWeight: 700 }}>Recent Activity</h3>
                  <div style={{ fontSize: 14, opacity: 0.8 }}>
                    Total transactions: {transactions.length}
                    <br />
                    This month:{" "}
                    {transactions.filter((t) => new Date(t.date).getMonth() === new Date().getMonth()).length}
                    <br />
                    Average per transaction: {formatCurrency(transactions.length ? total / transactions.length : 0)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "predictions" && (
            <div>
              <div style={{ marginBottom: 16, fontWeight: 700, fontSize: 16 }}>ML Spending Predictions</div>
              <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 12, padding: "1rem", color: "#111827" }}>
                <h3 style={{ margin: "0 0 1rem 0", fontSize: 16, fontWeight: 700 }}>Actual vs Predicted Spending</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {predictions.map((item) => (
                    <div
                      key={item.month}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        gap: 12,
                        alignItems: "center",
                        padding: "0.5rem",
                        background: "rgba(0,0,0,0.05)",
                        borderRadius: 8,
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>{item.month}</span>
                      <span>Actual: {formatCurrency(item.actual)}</span>
                      <span>Predicted: {formatCurrency(item.predicted)}</span>
                      <span
                        style={{
                          color: item.actual > item.predicted ? "#ef4444" : "#10b981",
                          fontWeight: 600,
                        }}
                      >
                        {item.actual > item.predicted ? "↑" : "↓"}{" "}
                        {Math.abs(((item.actual - item.predicted) / item.predicted) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "1rem", fontSize: 12, opacity: 0.7 }}>
                  Predictions powered by your FastAPI ML models
                </div>
              </div>
            </div>
          )}

          {activeTab === "anomalies" && (
            <div>
              <div style={{ marginBottom: 16, fontWeight: 700, fontSize: 16 }}>Anomaly Detection</div>
              <div style={{ display: "grid", gap: 12 }}>
                {anomalies.map((anomaly) => (
                  <div
                    key={anomaly.id}
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: 12,
                      padding: "1rem",
                      color: "#111827",
                      borderLeft: `4px solid ${anomaly.severity === "high" ? "#ef4444" : "#f59e0b"}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>{anomaly.merchant}</span>
                      <span
                        style={{
                          background: anomaly.severity === "high" ? "#ef4444" : "#f59e0b",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {anomaly.severity.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>
                      Amount: {formatCurrency(anomaly.amount)} • Category: {anomaly.category}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{anomaly.reason}</div>
                  </div>
                ))}
                <div style={{ fontSize: 12, opacity: 0.7, textAlign: "center" }}>
                  AI-powered anomaly detection via your FastAPI backend
                </div>
              </div>
            </div>
          )}

          {activeTab === "ai-chat" && (
            <div>
              <div style={{ marginBottom: 16, fontWeight: 700, fontSize: 16 }}>Natural Language Queries</div>

              {/* Chat History */}
              <div
                style={{
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: 12,
                  padding: "1rem",
                  marginBottom: "1rem",
                  minHeight: 200,
                  maxHeight: 300,
                  overflowY: "auto",
                  color: "#111827",
                }}
              >
                {chatHistory.length === 0 ? (
                  <div style={{ opacity: 0.7, textAlign: "center", padding: "2rem" }}>
                    Ask questions about your spending data using natural language!
                    <br />
                    Try: "How much did I spend on food last month?" or "Show me my biggest expenses"
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {chatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "0.75rem",
                          borderRadius: 8,
                          background: msg.type === "user" ? "#e0f2fe" : "#f3f4f6",
                          marginLeft: msg.type === "user" ? "2rem" : "0",
                          marginRight: msg.type === "ai" ? "2rem" : "0",
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, opacity: 0.7 }}>
                          {msg.type === "user" ? "You" : "AI Assistant"}
                        </div>
                        <div style={{ fontSize: 14 }}>{msg.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Query Input */}
              <form onSubmit={handleNLQuery}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    style={{ ...input, flex: 1 }}
                    placeholder="Ask about your spending data..."
                    value={nlQuery}
                    onChange={(e) => setNlQuery(e.target.value)}
                  />
                  <button type="submit" style={button}>
                    Ask AI
                  </button>
                </div>
              </form>

              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
                Powered by LangChain + your FastAPI backend
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", opacity: 0.8 }}>Enhanced frontend ready for FastAPI backend integration</div>
      </div>
    </div>
  )
}

export default App
