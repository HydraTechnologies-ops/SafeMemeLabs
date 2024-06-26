"use client"

import React, { useEffect, useState } from "react"

import "@/styles/tokenholderslist.css"

const chainIdToCovalentChainId = {
  250: "fantom-mainnet",
  4002: "fantom-testnet",
  31: "31", // Assuming 31 is supported by Covalent
  666666666: "666666666", // Assuming this is a valid ID for your chain in Covalent
  // Add other supported chain IDs as needed
}

const TokenHoldersList = ({ tokenAddress, chainId }) => {
  const [transactionSummary, setTransactionSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTransactionSummary = async () => {
      const covalentChainId = chainIdToCovalentChainId[chainId]
      if (!covalentChainId) {
        setError(`Chain ID ${chainId} not supported by Covalent`)
        setLoading(false)
        return
      }

      const apiKey = process.env.NEXT_PUBLIC_COVALENT_API_KEY
      const url = `https://api.covalenthq.com/v1/${covalentChainId}/address/${tokenAddress}/transactions_summary/?key=${apiKey}`

      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`)
        }
        const data = await response.json()
        if (!data.data || !data.data.items || data.data.items.length === 0) {
          throw new Error("No transaction data returned from API")
        }
        setTransactionSummary(data.data.items[0])
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactionSummary()
  }, [tokenAddress, chainId])

  if (loading) return <p className="loading">Loading...</p>
  if (error) return <p className="error">Error: {error}</p>

  const { total_count, latest_transaction, earliest_transaction } =
    transactionSummary

  return (
    <div>
      <h2 className="title">Transaction Summary</h2>
      <p className="total">
        <strong>Total Transactions:</strong> {total_count}
      </p>
      {latest_transaction && (
        <div className="transaction">
          <h3 className="subtitle">Latest Transaction</h3>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(latest_transaction.block_signed_at).toLocaleString()}
          </p>
          <p>
            <a
              href={latest_transaction.tx_detail_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Transaction Hash
            </a>
          </p>
        </div>
      )}
      {earliest_transaction && (
        <div className="transaction">
          <h3 className="subtitle">Earliest Transaction</h3>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(earliest_transaction.block_signed_at).toLocaleString()}
          </p>
          <p>
            <a
              href={earliest_transaction.tx_detail_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Transaction Hash
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export default TokenHoldersList
