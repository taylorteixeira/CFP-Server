import { catchAsyncError } from "../Middlewares/catchAsyncError.js"
import ErrorHandler from "../Middlewares/error.js"
import { Transaction } from "../Models/transaction.model.js"
import { Category } from "../Models/category.model.js"

export const addTransaction = catchAsyncError(async (req, res, next) => {
  const {
    type,
    category,
    date,
    note,
    amount,
    currency,
    recurrence,
    end,
    remind,
    transferTo,
    transferFrom,
  } = req.body
  const createdBy = req.user.id

  // Ensure necessary details are filled
  if (!type || !category || !date || !amount || !currency) {
    return next(new ErrorHandler("Please fill Necessary Details"))
  }

  // Handle the optional photo field
  let photo = null
  if (req.file) {
    photo = `/uploads/${req.file.filename}`
  }

  // Handle transferTo and transferFrom fields
  const newTransaction = await Transaction.create({
    type,
    category,
    date,
    note,
    amount,
    currency,
    recurrence,
    end,
    remind,
    photo,
    createdBy,
    transferTo: transferTo || null, // Set to null if empty string
    transferFrom: transferFrom || null, // Set to null if empty string
  })

  res.status(201).json({
    success: true,
    message: "Transaction added successfully",
    transaction: newTransaction,
  })
})

export const getTransactions = catchAsyncError(async (req, res) => {
  const { id } = req.user
  const transactions = await Transaction.find({ createdBy: id })

  res.status(200).json({
    success: true,
    count: transactions.length,
    transactions,
  })
})

export const editTransaction = catchAsyncError(async (req, res) => {
  const { id } = req.params
  const {
    type,
    category,
    date,
    note,
    amount,
    currency,
    recurrence,
    end,
    remind,
    createdBy,
    transferTo,
    transferFrom,
  } = req.body
  const photo = req.file ? req.file.filename : null

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    id,
    {
      type,
      category,
      date,
      note,
      amount,
      currency,
      recurrence,
      end,
      remind,
      photo,
      createdBy,
      transferTo,
      transferFrom,
    },
    { new: true }
  )

  if (!updatedTransaction) {
    return next(new ErrorHandler("Transaction not found"))
  }

  res.status(200).json({
    success: true,
    message: "Transaction updated successfully",
    transaction: updatedTransaction,
  })
})

export const deleteTransaction = catchAsyncError(async (req, res) => {
  const { id } = req.params
  const deletedTransaction = await Transaction.findByIdAndDelete(id)

  if (!deletedTransaction) {
    return next(new ErrorHandler("Transaction not found"))
  }

  res.status(200).json({
    success: true,
    message: "Transaction deleted successfully",
    transaction: deletedTransaction,
  })
})

export const getRecentTransactions = catchAsyncError(async (req, res) => {
  // Verifique se o usuário está autenticado
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    })
  }

  // Busca as transações mais recentes do usuário autenticado
  const recentTransactions = await Transaction.find({ createdBy: req.user._id })
    .sort({ date: -1 })
    .limit(5)

  res.status(200).json({
    success: true,
    transactions: recentTransactions,
  })
})
