"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const [backendMessage, setBackendMessage] = useState("");
  useEffect(() => {
  fetch("http://localhost:8000/api/data/")
    .then(res => res.json())
    .then(data => setBackendMessage(data.message));
}, []);
  
  

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
      Food: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      Shopping: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Transport: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Bills: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Entertainment: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }
    return colors[category] || colors.Other
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Financial Spending Dashboard</h1>
          <p className="text-muted-foreground">AI-powered insights with SQL analytics and ML predictions</p>
           {backendMessage && <p>{backendMessage}</p>}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(total)}</div>
              <p className="text-xs text-muted-foreground">{transactions.length} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(transactions.length ? total / transactions.length : 0)}
              </div>
              <p className="text-xs text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Predictions</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(2400)}</div>
              <p className="text-xs text-muted-foreground">Next month forecast</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anomalies</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{anomalies.length}</div>
              <p className="text-xs text-muted-foreground">Detected this month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              ML Predictions
            </TabsTrigger>
            <TabsTrigger value="anomalies" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Anomalies
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            {/* Add Transaction Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="merchant">Merchant</Label>
                      <Input
                        id="merchant"
                        placeholder="e.g., Starbucks"
                        value={merchant}
                        onChange={(e) => setMerchant(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button type="submit" className="w-full">
                        Add Transaction
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Transaction List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet. Add your first transaction above.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="font-semibold">{tx.merchant}</span>
                            <span className="text-sm text-muted-foreground">{tx.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge className={getCategoryColor(tx.category)}>{tx.category}</Badge>
                          <span className="text-sm text-muted-foreground">{tx.paymentMethod}</span>
                          <span className="font-bold text-lg">{formatCurrency(tx.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Spending Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
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
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Add transactions to see category breakdown
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Category Spending Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Count by Category</CardTitle>
                </CardHeader>
                <CardContent>
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
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Add transactions to see transaction counts
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  ML Spending Predictions
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Machine learning forecasts based on historical spending patterns
                </p>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anomalies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Spending Anomalies
                </CardTitle>
                <p className="text-sm text-muted-foreground">AI-detected unusual spending patterns and outliers</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {anomalies.map((anomaly) => (
                    <Alert key={anomaly.id}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{anomaly.merchant}</div>
                            <div className="text-sm text-muted-foreground">{anomaly.reason}</div>
                            <div className="text-xs text-muted-foreground">{anomaly.date}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(anomaly.severity)}>{anomaly.severity}</Badge>
                            <span className="font-bold">{formatCurrency(anomaly.amount)}</span>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Natural Language Queries
                </CardTitle>
                <p className="text-sm text-muted-foreground">Ask questions about your spending in plain English</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nlquery">Ask about your spending</Label>
                  <Textarea
                    id="nlquery"
                    placeholder="e.g., 'How much did I spend on food this month?' or 'What's my average transaction amount?'"
                    value={nlQuery}
                    onChange={(e) => setNlQuery(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleNLQuery} disabled={isQuerying || !nlQuery.trim()} className="w-full">
                  {isQuerying ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ask AI
                    </>
                  )}
                </Button>

                {queryResult && (
                  <Alert>
                    <MessageSquare className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold mb-1">AI Response:</div>
                      {queryResult}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-xs text-muted-foreground">
                  <strong>Try asking:</strong> "How much did I spend total?", "What's my food spending?", "Show me my
                  average transaction"
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          Ready for FastAPI backend integration • SQLite/Postgres • ML predictions • LangChain NL queries
        </div>
      </div>
    </div>
  )
}
