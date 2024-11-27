<h1 align="center">Ledge™</h1>
<p align="center"><i>Welcome to Ledge. Your personal ledger for managing financial data, invoices, and transactions seamlessly.</i></p>

---

<h2>Table of Contents</h2>
<ul>
  <li><a href="#introduction">Introduction</a></li>
  <li><a href="#features">Features</a></li>
  <li><a href="#getting-started">Getting Started</a></li>
  <li><a href="#endpoints">Endpoints</a></li>
  <li><a href="#references">References</a></li>
  <li><a href="#built-with">Built With</a></li>
  <li><a href="#meet-the-team">Meet the Team</a></li>
</ul>

---

<h2 id="introduction">Introduction</h2>
<p>
Ledge is a streamlined solution designed to help users organize and manage their financial data with precision. From handling invoices to tracking transactions, Ledge empowers businesses and individuals to stay on top of their finances effortlessly. <br /> Powered by AI.
</p>

---

<h2 id="features">Features</h2>
<ul>
  <li><b>Invoice Management</b>: Store and retrieve detailed invoices, including amounts, dates, and statuses.</li>
  <li><b>Transaction Tracking</b>: Link transactions to invoices for a comprehensive financial overview.</li>
  <li><b>Data Retrieval</b>: Robust API endpoints for fetching user-specific data, invoice summaries, and more. See <a href="#endpoints">Endpoints</a> for details.</li>
  <li><b>User Roles</b>: Role-based access control, allowing managers and admins exclusive access to sensitive data.</li>
  <li><b>Analytics</b>: Generate detailed reports and statistics on user activity, logins, and financial performance.</li>
  <li><b>State of the Art File Compression</b>: Files are seamlessly compressed and stored safely.</li>
</ul>

---

<h2 id="getting-started">Getting Started</h2>
<p>Follow the steps below to get Ledge up and running on your local machine for development and testing purposes.</p>

<h3>Prerequisites</h3>
<ul>
  <li><a href="https://dotnet.microsoft.com/download">.NET SDK</a> (version .NET 6 or higher)</li>
  <li><a href="https://docs.microsoft.com/en-us/ef/core/">Entity Framework Core</a>:</li>
  <ul>
    <li>EntityFrameworkCore (version 6.0.25)</li>
    <li>EntityFrameworkCore.SqlServer (version 6.0.25)</li>
    <li>EntityFrameworkCore.Tools (version 6.0.25)</li>
  </ul>
  <li>A database such as <a href="https://www.microsoft.com/en-us/sql-server">SQL Server</a> or compatible instance.</li>
  <li>API testing tools like <a href="https://www.postman.com/">Postman</a>, <a href="https://swagger.io/">Swagger</a>, or <a href="https://insomnia.rest/">Insomnia</a>.</li>
</ul>
<p><b>Note:</b> This project was developed using Visual Studio, but you can use any IDE of your choice.</p>

<h3>Installing the Project</h3>
<ol>
  <li>Clone the Repository:</li>
  <pre><code>git clone https://github.com/YourOrganization/Ledge.git</code></pre>
  <li>Navigate to the Project Directory:</li>
  <pre><code>cd Ledge</code></pre>
  <li>Build the Project:</li>
  <pre><code>dotnet build</code></pre>
  <li>Run Migrations and Update Database:</li>
  <pre><code>dotnet ef database update</code></pre>
</ol>

---

<h2 id="endpoints">Endpoints</h2>

<h3>GET Endpoints</h3>
<h4>Invoice Endpoints</h4>
<ul>
  <li><code>/invoices</code> - Get all invoices.</li>
  <li><code>/invoices/{invoiceId}</code> - Get a specific invoice by ID.</li>
</ul>

<h4>Transaction Endpoints</h4>
<ul>
  <li><code>/transactions</code> - Get all transactions.</li>
  <li><code>/transactions/{transactionId}</code> - Get a specific transaction.</li>
</ul>

<h4>Statistics Endpoints</h4>
<ul>
  <li><code>/statistics/users/logins/week</code> - Get weekly login statistics for users.</li>
  <li><code>/statistics/users/logins/year</code> - Get yearly login statistics for users.</li>
</ul>

<h3>POST Endpoints</h3>
<h4>Invoice Endpoints</h4>
<ul>
  <li><code>/invoices</code> - Add a new invoice.</li>
</ul>
<h4>Transaction Endpoints</h4>
<ul>
  <li><code>/transactions</code> - Add a new transaction.</li>
</ul>

---

<h2 id="references">References</h2>
<ul>
  <li><a href="https://docs.microsoft.com/en-us/ef/core/">Microsoft Entity Framework Core</a></li>
  <li><a href="https://swagger.io/">Swagger</a></li>
  <li><a href="https://www.postman.com/">Postman</a></li>
  <li><a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob Storage</a></li>
</ul>

---

<h2 id="built-with">Built With</h2>
<ul>
  <li><b>C#</b> - Primary programming language.</li>
  <li><b>ASP.NET Core</b> - Web API framework.</li>
  <li><b>Entity Framework Core</b> - ORM for database interactions.</li>
  <li><b>Azure</b> - Deployed through Azure cloud service</li>
  <li><b>Azure Blob Storage</b> - File storage.</li>
  <li><b>Azure Form Recognizer</b> - Text scanning service.</li>
  <li><b>MS SQL</b> - Relational database.</li>
</ul>

---

<h2 id="meet-the-team">Meet the Team</h2>
<ul>
  <li>Adrian Rozsahegyi - <a href="https://github.com/adrozs">adrozs</a></li>
  <li>Alexander Lundquist - <a href="https://github.com/chasalex">chasalex</a></li>
  <li>Hjalmar Stranninge - <a href="https://github.com/hjalmarstranninge">hjalmarstranninge</a></li>
  <li>Jonny Touma - <a href="https://github.com/jonzy81">jonzy81</a></li>
  <li>Fady Hatta - <a href="https://github.com/manhattaa">manhattaa</a></li>
</ul>

<p align="center"><i>Welcome to Ledge — Your trusted partner in financial management!</i></p>
