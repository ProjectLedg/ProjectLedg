import React from 'react'
import mockAnnualReport from './mockAnnualReport.json'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function AnnualReportPreview() {
    const report = mockAnnualReport.annualReport2023[0];
    return (
        <TabsContent value="annualReports">
            <Card>
                <CardContent className="">
                    <h2>Annual Report for {report.company.name}</h2>
                    <p><strong>Organization Number:</strong> {report.company.organization_number}</p>
                    <p><strong>Fiscal Year:</strong> {report.company.fiscal_year}</p>

                    <h3>Confirmation</h3>
                    <p><strong>Date:</strong> {report.confirmation.date}</p>
                    <p><strong>Signature:</strong> {report.confirmation.signature}</p>
                    <p><strong>Approval:</strong> {report.confirmation.approval}</p>

                    <h3>Financials</h3>
                    <h4>Income Statement</h4>
                    <p><strong>Net Revenue:</strong> {report.financials.income_statement.net_revenue} SEK</p>
                    <p><strong>External Expenses:</strong> {report.financials.income_statement.external_expenses} SEK</p>
                    <p><strong>Personnel Expenses:</strong> {report.financials.income_statement.personnel_expenses} SEK</p>
                    <p><strong>Operating Income:</strong> {report.financials.income_statement.operating_income} SEK</p>
                    <p><strong>Financial Items:</strong> {report.financials.income_statement.financial_items} SEK</p>
                    <p><strong>Result After Financial Items:</strong> {report.financials.income_statement.result_after_financial_items} SEK</p>
                    <p><strong>Tax on Result:</strong> {report.financials.income_statement.tax_on_result} SEK</p>
                    <p><strong>Annual Result:</strong> {report.financials.income_statement.annual_result} SEK</p>

                    <h4>Balance Sheet</h4>
                    <h5>Assets</h5>
                    <p><strong>Total Fixed Assets:</strong> {report.financials.balance_sheet.assets.total_assets} SEK</p>
                    <h5>Equity and Liabilities</h5>
                    <p><strong>Total Equity:</strong> {report.financials.balance_sheet.equity_and_liabilities.total_equity_and_liabilities} SEK</p>

                    <h4>Profit Allocation</h4>
                    <p><strong>Annual Profit:</strong> {report.financials.profit_allocation.annual_profit} SEK</p>
                    <p><strong>Retained Earnings:</strong> {report.financials.profit_allocation.retained_earnings} SEK</p>
                    <p><strong>Dividends:</strong> {report.financials.profit_allocation.dividends} SEK</p>

                    <h3>Notes</h3>
                    <p><strong>Note 1 (Accounting Principles):</strong> {report.notes.note_1.accounting_principles}</p>
                    <p><strong>Note 2 (Average Number of Employees):</strong> {report.notes.note_2.average_number_of_employees}</p>
                </CardContent>
            </Card>
        </TabsContent>
    );
}


