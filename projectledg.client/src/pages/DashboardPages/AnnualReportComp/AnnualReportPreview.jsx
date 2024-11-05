import React from 'react'
import mockAnnualReport from './mockAnnualReport.json'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function AnnualReportPreview() {
    const report = mockAnnualReport.annualReport2023[0];
    return (
        <TabsContent value="annualReports">
            <Card className="rounded-none shadow-none border-none">
                <CardContent className="">
                    <h1><strong>Årsredovisning för</strong> {report.company.name}</h1>
                    <p><strong>Organisationsnummer:</strong> {report.company.organization_number}</p>
                    <p><strong>Räkenskapsår:</strong> {report.company.fiscal_year}</p>

                    <h3>Bekräftelse</h3>
                    <p><strong>Datum:</strong> {report.confirmation.date}</p>
                    <p><strong>Underskrift:</strong> {report.confirmation.signature}</p>
                    <p><strong>Godkännande:</strong> {report.confirmation.approval}</p>

                    <h3>Ekonomi</h3>
                    <h4>Resultaträkning</h4>
                    <p><strong>Nettoomsättning:</strong> {report.financials.income_statement.net_revenue} SEK</p>
                    <p><strong>Externa kostnader:</strong> {report.financials.income_statement.external_expenses} SEK</p>
                    <p><strong>Personalkostnader:</strong> {report.financials.income_statement.personnel_expenses} SEK</p>
                    <p><strong>Rörelseresultat:</strong> {report.financials.income_statement.operating_income} SEK</p>
                    <p><strong>Finansiella poster:</strong> {report.financials.income_statement.financial_items} SEK</p>
                    <p><strong>Resultat efter finansiella poster:</strong> {report.financials.income_statement.result_after_financial_items} SEK</p>
                    <p><strong>Skatt på årets resultat:</strong> {report.financials.income_statement.tax_on_result} SEK</p>
                    <p><strong>Årets resultat:</strong> {report.financials.income_statement.annual_result} SEK</p>

                    <h4>Balansräkning</h4>
                    <h5>Tillgångar</h5>
                    <p><strong>Summa anläggningstillgångar:</strong> {report.financials.balance_sheet.assets.total_assets} SEK</p>
                    <h5>Eget kapital och skulder</h5>
                    <p><strong>Summa eget kapital:</strong> {report.financials.balance_sheet.equity_and_liabilities.total_equity_and_liabilities} SEK</p>

                    <h4>Resultatdisposition</h4>
                    <p><strong>Årets vinst:</strong> {report.financials.profit_allocation.annual_profit} SEK</p>
                    <p><strong>Balanserat resultat:</strong> {report.financials.profit_allocation.retained_earnings} SEK</p>
                    <p><strong>Utdelningar:</strong> {report.financials.profit_allocation.dividends} SEK</p>

                    <h3>Noter</h3>
                    <p><strong>Not 1 (Redovisningsprinciper):</strong> {report.notes.note_1.accounting_principles}</p>
                    <p><strong>Not 2 (Medelantalet anställda):</strong> {report.notes.note_2.average_number_of_employees}</p>

                </CardContent>
            </Card>
        </TabsContent>
    );
}


