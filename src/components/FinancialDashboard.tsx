"use client"

import type React from "react"
import { useState } from "react"
import {
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  CreditCard,
  MessageSquare,
  BarChart3,
  AlertTriangle,
  Brain,
  Database,
  Zap,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

interface Transaction {
  id: number
  merchant: string
  category: string
  amount: number
  date: string
  paymentMethod: string
}

interface Prediction {
  month: string
  predicted: number
  actual?: number
}

interface Anomaly {
  id: number
  merchant: string
  amount: number
  date: string
  reason: string
  severity: "low" | "medium" | "high"
}

export default function FinancialDashboard() {
  // Form state
  const [merchant, setMerchant] = useState("")
  const [category, setCategory] = useState("Food")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Credit Card")
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("transactions")

  const [nlQuery, setNlQuery] = useState("")
  const [queryResult, setQueryResult] = useState("")
  const [isQuerying, setIsQuerying] = useState(false)

  // Local transactions (frontend only for now)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [predictions] = useState<Prediction[]>([
    { month: "Jan", predicted: 2500, actual: 2400 },
    { month: "Feb", predicted: 2300, actual: 2450 },
    { month: "Mar", predicted: 2600, actual: 2580 },
    { month: "Apr", predicted: 2400, actual: undefined },
    { month: "May", predicted: 2700, actual: undefined },
    { month: "Jun", predicted: 2500, actual: undefined },
  ])

  const [anomalies] = useState<Anomaly[]>([
    {
      id: 1,
      merchant: "Luxury Store XYZ",
      amount: 1200,
      date: "2024-01-15",
      reason: "Unusually high amount for shopping",
      severity: "high",
    },
    {
      id: 2,
      merchant: "Gas Station ABC",
      amount: 150,
      date: "2024-01-14",
      reason: "Higher than typical gas expense",
      severity: "medium",
    },
    {
      id: 3,
      merchant: "Restaurant DEF",
      amount: 85,
      date: "2024-01-13",
      reason: "Above average dining cost",
      severity: "low",
    },
  ])

  const categories = ["Food", "Shopping", "Transport", "Bills", "Entertainment", "Other"]
  const paymentMethods = ["Credit Card", "Debit Card", "Cash", "Bank Transfer"]

  const formatCurrency = (n: number) => Number(n || 0).toLocaleString(undefined, { style: "currency", currency: "USD" })

  const total = transactions.reduce((s, t) => s + (Number(t.amount) || 0), 0)
  const filtered = transactions.filter((t) =>
    `${t.merchant} ${t.category} ${t.paymentMethod}`.toLowerCase().includes(search.toLowerCase()),
  )

  const categorySpending = categories
    .map((cat) => ({
      name: cat,
      value: transactions.filter((t) => t.category === cat).reduce((sum, t) => sum + t.amount, 0),
      count: transactions.filter((t) => t.category === cat).length,
    }))
    .filter((item) => item.value > 0)

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#f59e0b", "#6b7280"]

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!merchant || !amount) return
    const newTx: Transaction = {
      id: Date.now(),
      merchant,
      category,
      amount: Number(amount),
      date: date || new Date().toISOString().slice(0, 10),
      paymentMethod,
    }
    setTransactions((prev) => [newTx, ...prev])
    // Reset form
    setMerchant("")
    setCategory("Food")
    setAmount("")
    setDate("")
    setPaymentMethod("Credit Card")
  }

  const handleNLQuery = async () => {
    if (!nlQuery.trim()) return

    setIsQuerying(true)
    // Simulate API call to FastAPI backend
    setTimeout(() => {
      // Mock response based on query
      if (nlQuery.toLowerCase().includes("total") || nlQuery.toLowerCase().includes("spent")) {
        setQueryResult(`Total spending: ${formatCurrency(total)} across ${transactions.length} transactions.`)
      } else if (nlQuery.toLowerCase().includes("food") || nlQuery.toLowerCase().includes("restaurant")) {
        const foodSpending = transactions.filter((t) => t.category === "Food").reduce((sum, t) => sum + t.amount, 0)
        setQueryResult(
          `Food spending: ${formatCurrency(foodSpending)} from ${transactions.filter((t) => t.category === "Food").length} transactions.`,
        )
      } else if (nlQuery.toLowerCase().includes("average")) {
        const avg = transactions.length ? total / transactions.length : 0
        setQueryResult(`Average transaction amount: ${formatCurrency(avg)}`)
      } else {
        setQueryResult(
          `I found ${transactions.length} transactions totaling ${formatCurrency(total)}. Try asking about specific categories, totals, or averages.`,
        )
      }
      setIsQuerying(false)
    }, 1500)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-emerald-100 text-emerald-800",
      Shopping: "bg-blue-100 text-blue-800",
      Transport: "bg-purple-100 text-purple-800",
      Bills: "bg-red-100 text-red-800",
      Entertainment: "bg-yellow-100 text-yellow-800",
      Other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.Other
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const tabs = [
    { id: "transactions", label: "Transactions", icon: Database },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "predictions", label: "ML Predictions", icon: Brain },
    { id: "anomalies", label: "Anomalies", icon: AlertTriangle },
    { id: "chat", label: "AI Chat", icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Financial Spending Dashboard</h1>
          <p className="text-gray-600">AI-powered insights with SQL analytics and ML predictions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spending</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(total)}</p>
                <p className="text-xs text-gray-500">{transactions.length} transactions</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Transaction</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(transactions.length ? total / transactions.length : 0)}
                </p>
                <p className="text-xs text-gray-500">Per transaction</p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Predictions</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(2400)}</p>
                <p className="text-xs text-gray-500">Next month forecast</p>
              </div>
              <Brain className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Anomalies</p>
                <p className="text-2xl font-bold text-emerald-600">{anomalies.length}</p>
                <p className="text-xs text-gray-500">Detected this month</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "transactions" && (
              <div className="space-y-6">
                {/* Add Transaction Form */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Transaction
                  </h3>
                  <form onSubmit={handleAdd} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Merchant</label>
                        <input
                          type="text"
                          placeholder="e.g., Starbucks"
                          value={merchant}
                          onChange={(e) => setMerchant(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {paymentMethods.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          Add Transaction
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Transaction List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                  {filtered.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions yet. Add your first transaction above.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filtered.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                              <span className="font-semibold">{tx.merchant}</span>
                              <span className="text-sm text-gray-500">{tx.date}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tx.category)}`}
                            >
                              {tx.category}
                            </span>
                            <span className="text-sm text-gray-500">{tx.paymentMethod}</span>
                            <span className="font-bold text-lg">{formatCurrency(tx.amount)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Spending Pie Chart */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
                    {categorySpending.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categorySpending}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categorySpending.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500">
                        Add transactions to see category breakdown
                      </div>
                    )}
                  </div>

                  {/* Category Spending Bar Chart */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Transaction Count by Category</h3>
                    {categorySpending.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categorySpending}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500">
                        Add transactions to see transaction counts
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "predictions" && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">ML Spending Predictions</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Machine learning forecasts based on historical spending patterns
                </p>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Spending" />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted Spending"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === "anomalies" && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Spending Anomalies</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">AI-detected unusual spending patterns and outliers</p>
                <div className="space-y-4">
                  {anomalies.map((anomaly) => (
                    <div key={anomaly.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{anomaly.merchant}</div>
                          <div className="text-sm text-gray-600">{anomaly.reason}</div>
                          <div className="text-xs text-gray-500">{anomaly.date}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(anomaly.severity)}`}
                          >
                            {anomaly.severity}
                          </span>
                          <span className="font-bold">{formatCurrency(anomaly.amount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "chat" && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Natural Language Queries</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">Ask questions about your spending in plain English</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ask about your spending</label>
                    <textarea
                      placeholder="e.g., 'How much did I spend on food this month?' or 'What's my average transaction amount?'"
                      value={nlQuery}
                      onChange={(e) => setNlQuery(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    onClick={handleNLQuery}
                    disabled={isQuerying || !nlQuery.trim()}
                    className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isQuerying ? (
                      <>
                        <Zap className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4" />
                        Ask AI
                      </>
                    )}
                  </button>

                  {queryResult && (
                    <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-semibold text-blue-900 mb-1">AI Response:</div>
                          <div className="text-blue-800">{queryResult}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    <strong>Try asking:</strong> "How much did I spend total?", "What's my food spending?", "Show me my
                    average transaction"
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          Ready for FastAPI backend integration • SQLite/Postgres • ML predictions • LangChain NL queries
        </div>
      </div>
    </div>
  )
}
