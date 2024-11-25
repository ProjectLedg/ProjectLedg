import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table } from "@/components/ui/table";
import axios from "axios";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [ingoingInvoices, setIngoingInvoices] = useState([]);
  const [outgoingInvoices, setOutgoingInvoices] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isDetailedDialogOpen, setIsDetailedDialogOpen] = useState(false); // For detailed modal
  const [detailedData, setDetailedData] = useState(null); // For detailed data
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // For edit modal
  const [editData, setEditData] = useState(null); // Data being edited
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://localhost:7223/api/User/all");
      setUsers(response.data || []);
    } catch (error) {
      setError("Failed to fetch users: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIngoingInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://localhost:7223/api/IngoingInvoice/all");
      setIngoingInvoices(response.data || []);
    } catch (error) {
      setError("Failed to fetch ingoing invoices: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOutgoingInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://localhost:7223/api/OutgoingInvoice/all");
      setOutgoingInvoices(response.data || []);
    } catch (error) {
      setError("Failed to fetch outgoing invoices: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://localhost:7223/api/Admin/getAllAdmins");
      setAdmins(response.data || []);
    } catch (error) {
      setError("Failed to fetch admins: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetailedData = async (id, type) => {
    try {
      const response = await axios.get(`https://localhost:7223/api/${type}/${id}`);
      setDetailedData(response.data);
      setIsDetailedDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch detailed data:", error);
    }
  };

  const handleEdit = (data, type) => {
    setEditData({ ...data, type });
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editData) return;

    try {
      await axios.put(`https://localhost:7223/api/${editData.type}/${editData.id}`, editData);
      setIsEditDialogOpen(false);
      refreshData();
    } catch (error) {
      setError(`Failed to edit ${editData.type}: ${error.message}`);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      await axios.delete(`https://localhost:7223/api/${type}/${id}`);
      refreshData();
    } catch (error) {
      setError(`Failed to delete ${type}: ${error.message}`);
    }
  };

  const refreshData = () => {
    fetchUsers();
    fetchIngoingInvoices();
    fetchOutgoingInvoices();
    fetchAdmins();
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const allData = [
      ...users.map((item) => ({ ...item, type: "User" })),
      ...ingoingInvoices.map((item) => ({ ...item, type: "IngoingInvoice" })),
      ...outgoingInvoices.map((item) => ({ ...item, type: "OutgoingInvoice" })),
      ...admins.map((item) => ({ ...item, type: "Admin" })),
    ];

    const results = allData.filter((item) =>
      Object.values(item)
        .filter((value) => typeof value === "string" || typeof value === "number")
        .some((value) => value.toString().toLowerCase().includes(query))
    );

    setFilteredResults(results);
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="Users" className="w-full">
        <TabsList className="flex w-min justify-start">
          <TabsTrigger value="Users">Kunder</TabsTrigger>
          <TabsTrigger value="Ingoing">Ingående Fakturor</TabsTrigger>
          <TabsTrigger value="Outgoing">Utgående Fakturor</TabsTrigger>
          <TabsTrigger value="Admins">Administratörer</TabsTrigger>
          <TabsTrigger value="Search">Sökning</TabsTrigger>
        </TabsList>


                {/* Users Tab */}
                <TabsContent value="Users">
          <Card>
            <CardHeader>
              <CardTitle>Hantera Användare</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <thead>
                  <tr>
                    <th>Kund-ID</th>
                    <th>Förnamn</th>
                    <th>Email</th>
                    <th>Åtgärder</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td
                        className="cursor-pointer text-blue-500"
                        onClick={() => fetchDetailedData(user.id, "User")}
                      >
                        {user.id}
                      </td>
                      <td>{user.firstName}</td>
                      <td>{user.email}</td>
                      <td>
                        <Button size="sm" onClick={() => handleEdit(user, "User")}>
                          Ändra
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(user.id, "User")}
                          className="ml-2"
                        >
                          Ta bort
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ingoing Invoices Tab */}
        <TabsContent value="Ingoing">
          <Card>
            <CardHeader>
              <CardTitle>Hantera Ingående Fakturor</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <thead>
                  <tr>
                    <th>Faktura-ID</th>
                    <th>Fakturanummer</th>
                    <th>Kundnamn</th>
                    <th>Åtgärder</th>
                  </tr>
                </thead>
                <tbody>
                  {ingoingInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td
                        className="cursor-pointer text-blue-500"
                        onClick={() => fetchDetailedData(invoice.id, "IngoingInvoice")}
                      >
                        {invoice.id}
                      </td>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.customerName}</td>
                      <td>
                        <Button size="sm" onClick={() => handleEdit(invoice, "IngoingInvoice")}>
                          Ändra
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(invoice.id, "IngoingInvoice")}
                          className="ml-2"
                        >
                          Ta bort
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outgoing Invoices Tab */}
        <TabsContent value="Outgoing">
          <Card>
            <CardHeader>
              <CardTitle>Hantera Utgående Fakturor</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <thead>
                  <tr>
                    <th>Faktura-ID</th>
                    <th>Fakturanummer</th>
                    <th>Kundnamn</th>
                    <th>Åtgärder</th>
                  </tr>
                </thead>
                <tbody>
                  {outgoingInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td
                        className="cursor-pointer text-blue-500"
                        onClick={() => fetchDetailedData(invoice.id, "OutgoingInvoice")}
                      >
                        {invoice.id}
                      </td>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.customerName}</td>
                      <td>
                        <Button size="sm" onClick={() => handleEdit(invoice, "OutgoingInvoice")}>
                          Ändra
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(invoice.id, "OutgoingInvoice")}
                          className="ml-2"
                        >
                          Ta bort
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admins Tab */}
        <TabsContent value="Admins">
          <Card>
            <CardHeader>
              <CardTitle>Hantera Administratörer</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <thead>
                  <tr>
                    <th>Admin-ID</th>
                    <th>Förnamn</th>
                    <th>Email</th>
                    <th>Åtgärder</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td
                        className="cursor-pointer text-blue-500"
                        onClick={() => fetchDetailedData(admin.id, "Admin")}
                      >
                        {admin.id}
                      </td>
                      <td>{admin.firstName}</td>
                      <td>{admin.email}</td>
                      <td>
                        <Button size="sm" onClick={() => handleEdit(admin, "Admin")}>
                          Ändra
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(admin.id, "Admin")}
                          className="ml-2"
                        >
                          Ta bort
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="Search">
          <Card>
            <CardHeader>
              <CardTitle>Sök genom all data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Sök här..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full"
                />
              </div>
              <Table>
                <thead>
                  <tr>
                    <th>Typ</th>
                    <th>ID</th>
                    <th>Namn</th>
                    <th>Ytterligare Info</th>
                    <th>Åtgärder</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.length > 0 ? (
                    filteredResults.map((item, index) => (
                      <tr key={index}>
                        <td>{item.type}</td>
                        <td
                          className="cursor-pointer text-blue-500"
                          onClick={() => fetchDetailedData(item.id, item.type)}
                        >
                          {item.id}
                        </td>
                        <td>{item.firstName || item.customerName || "N/A"}</td>
                        <td>{item.invoiceNumber || item.email || "Ingen ytterligare info"}</td>
                        <td>
                          <Button size="sm" onClick={() => handleEdit(item, item.type)}>
                            Ändra
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id, item.type)}
                            className="ml-2"
                          >
                            Ta bort
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">Inga resultat hittades</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for Detailed View */}
      <Dialog open={isDetailedDialogOpen} onOpenChange={setIsDetailedDialogOpen}>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>Detaljerad Vy</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {detailedData ? (
        <pre
          className="bg-gray-100 p-4 rounded overflow-x-auto"
          style={{
            maxWidth: "100%",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(detailedData, null, 2)}
        </pre>
      ) : (
        <p>Laddar...</p>
      )}
    </div>
    <Button onClick={() => setIsDetailedDialogOpen(false)} className="w-full">
      Stäng
    </Button>
  </DialogContent>
</Dialog>

      {/* Dialog for Edit */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Redigera Data</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 grid-cols-2">
            {editData &&
              Object.keys(editData).map((key) =>
                key !== "type" && (
                  <div key={key} className="col-span-1">
                    <Label htmlFor={key}>{key}</Label>
                    <Input
                      id={key}
                      value={editData[key] || ""}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      placeholder={`Enter ${key}`}
                    />
                  </div>
                )
              )}
          </div>
          <Button onClick={handleEditSave} className="w-full">
            Spara ändringar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
