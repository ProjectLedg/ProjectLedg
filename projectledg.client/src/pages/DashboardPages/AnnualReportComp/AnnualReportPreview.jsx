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
                    {/* Title and Certification */}
                    <div className="text-center mt-3 flex flex-col">
                        <h1 className="font-bold">Årsredovisning</h1>
                        <h4>för</h4>
                        <h1>{company.CompanyName}</h1>
                        <h3>Org.nr {company.OrgNumber}</h3>
                        <h3>Räkenskapsåret {currentDate.Year}</h3>
                        <h3 className="mt-3">Fastställelseintyg</h3>
                        <p className="text-justify">Jag intygar att resultaträkningen och balansräkningen har fastställts på årsstämma {currentDate}.</p>
                        <p className="text-justify">Årsstämman beslöt att godkänna styrelsens förslag till vinstdisposition.</p>
                        <p className="text-justify">Jag intygar att innehållet i dessa elektroniska handlingar överensstämmer med originalen och att originalen undertecknats av samtliga personer som enligt lag ska underteckna dessa.</p>
                        <p className="text-justify">Årsredovisningen är upprättad i svenska kronor, SEK. Om inte annat särskilt anges, redovisas alla belopp i hela kronor (kr). Uppgifter inom parentes avser föregående år</p>
                        <p className="text-left">Elektroniskt underskriven av: <br />xxxx, xxxx<br />{currentDate}</p>
                    </div>

                    {/* Managment Report */}
                    <div className="text-center mt-3 flex flex-col">
                        <br />
                        <br />
                        <h2>Förvaltningsberättelse</h2>
                        <h3>Verksamheten</h3>
                        <div>
                            <p className="font-bold flex flex-row">Allmänt om verksamheten:</p>
                            <p>{company.CompanyDescription}.</p>
                        </div>
                        <p>Företaget har sitt säte i {company.Address}.</p>
                        <p>Väsentliga händelser under räkenskapsåret presenteras i noterna.</p>
                    </div>

                    {/* Result Disposition */}
                    <div className="flex flex-col">
                        <br />
                        <br />
                        <h2>Resultatdisposition</h2>
                        <p>Styrelsen föreslår att vinstmedlen disponeras enligt följande</p>
                        <ul>
                            <li>Årets resultat: {profit}</li>
                        </ul>
                        <p>Summa disponeras så att i ny räkning överföres: xxxxx</p>
                        <p>Summa disponeras till aktieägare: xxxxxx</p>
                        <p>Företagets resultat och ställning i övrigt framgår av efterföljande resultat- och balansräkning med noter.</p>
                    </div>

                    {/* Income Statement */}
                    <div className="flex flex-col">
                        <br />
                        <br />
                        <h2>Resultaträkning</h2>
                        <p>Nettoomsättning: {(reveune - moms)} kr</p>
                        <p>Övriga externa kostnader: - {externalExpenses} kr</p>
                        <p>Personalkostnader: -{staffExpenses} kr</p>
                        <p>Rörelseresultat: {profit} kr</p>
                        <p>Finansiella poster: {financialPost} kr</p>
                        <p>Resultat efter finansiella poster: {(financialPost - profit)} kr</p>
                        <p>Skatt på årets resultat: -{(profit * companyTaxRate)} kr</p>
                        <p>Årets resultat: {profit + financialPost - (profit * companyTaxRate)} kr</p>
                    </div>

                    {/* Balance sheet  */}
                    <div className="flex flex-col">
                        <br />
                        <br />
                        <h2>Balansräkning - Tillgångar</h2>
                        <h3>Anläggningstillgångar:</h3>
                        <ul>
                            <li>
                                Immanteriella tillgångar: {intangibleAssets} kr
                            </li>
                            <li>
                                Materiella tillgångar: {tangibleAssets} kr
                            </li>
                            <li>
                                Finansiella tillgångar: {financialAssets} kr
                            </li>
                        </ul>
                        <p>Summa anläggningstillgånar: {(intangibleAssets + tangibleAssets + financialAssets)} kr</p>
                        <h3>Omsättningstillgångar:</h3>
                        <ul>
                            <li>
                                Lager: {currentAssets.Stock} kr
                            </li>
                            <li>
                                Kundfordringar: {currentAssets.AccountsReceivable} kr
                            </li>
                            <li>
                                Kassa och Bank: {currentAssets.BankKassa} kr
                            </li>
                            <li>
                                Kortfristiga fordringar: {currentAssets.ShortTermReceivables} kr
                            </li>
                            <p>Summa Omsättningstillgångar: kr</p>
                            <div className="font-bold">Summa tillgångar: kr</div>
                        </ul>
                    </div>

                    {/* Balance sheet Assets*/}
                    <div className="flex flex-col">
                        <br />
                        <br />
                        <h2>Balansräkning - Eget Kapital och Skulder</h2>
                        <h3>Eget kapital:</h3>
                        <p>Aktiekapital: {equityCapital.StockCapital} kr</p>
                        <p>Balanserat resultat: {equityCapital.BalancedResult}kr</p>
                        <p>Årets resultat: {equityCapital.YearResult} kr</p>
                        <p>Summa eget kapital: kr</p>
                    </div>

                    {/* Balance sheet equity */}
                    <div className="flex flex-col">
                        <br />
                        <br />
                        <h2>Balansräkning - Eget Kapital och Skulder</h2>
                        <h3>Eget kapital:</h3>
                        <p>Aktiekapital: {equityCapital.StockCapital} kr</p>
                        <p>Balanserat resultat: {equityCapital.BalancedResult}kr</p>
                        <p>Årets resultat: {equityCapital.YearResult} kr</p>
                        <p>Summa eget kapital: kr</p>
                    </div>

                    {/* Longterm Liabilities */}
                    <div className="flex flex-col">
                        <br />
                        <br />
                        <h3>Långfristiga skulder:</h3>
                        <p>Summa långfristiga skulder:{longTermLiabilities} kr.</p>
                        <br />
                        <br />
                        {/* Shortterm liabilities */}
                        <h3>Kortfristiga skulder:</h3>
                        <p>Leveranstörsskulder: {shortTermLiabilities.AccountsPayable} kr</p>
                        <p>Kortfristiga lån: {shortTermLiabilities.ShortTermLoans} kr</p>
                        <p>Skatter och avgifter: {shortTermLiabilities.TaxesAndFees} kr</p>
                        <p>Summa kortfristiga skulder: kr</p>
                        <p className="font-bold">Summa Eget kapital och skulder: kr</p>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col">
                        <br />
                        <br />
                        <p>Noter</p>
                        <h3>Not 1: Redovisningsprinciper:</h3>
                        <p>Årsredovisningen är upprättad i enlighet med årsredovisningslagen och Bokföringsnämndens allmänna råd (BFNAR 2016:10) om årsredovisning i mindre företag.</p>
                        <h3>Not 2: Medelantalet anställda:</h3>
                        <p>Antal anställda under året:{company.AmountOfEmployees}. </p>
                        <h3>Not 3: Intäkter och kostnader:</h3>
                        <p>Årets omsättning uppgår till {reveune} kr, med övriga kostnader på {externalExpenses} kr och personkostnader på {staffExpenses} kr. </p>
                        <h3>Not 4: Avskrivningar på anläggningstillgångar: </h3>
                        <p>Avskrivningar under året uppgick till {intangibleAssets} kr för immateriella tillgångar, {tangibleAssets}kr för materiella tillgångar, och {financialAssets} kr för finansiella tillgångar. </p>
                        <h3>Not 5: Skulder och eget kapital:</h3>
                        <p>Långfristiga skulder uppgår till {longTermLiabilities} kr, medan kortfristiga skulder uppgår till {(shortTermLiabilities.AccountsPayable + shortTermLiabilities.ShortTermLoans + shortTermLiabilities.TaxesAndFees)} kr, Det egna kapitalet uppgår till {equityCapital.StockCapital + equityCapital.BalancedResult + equityCapital.YearResult} kr, vilket inkluderar akitekapital och balanserat resultat. </p>
                    </div>

                    <div className="flex flex-col">
                        <br />
                        <br />
                        <h2>Underskrifter</h2>
                        <p>Styrelsen intygar härmed att årsredovisningen upprättad i enlighet med årsredovisningslagen och ger en rättvisande bild av företagets ställning och resultat.</p>
                        <p>xxxxxx</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}


