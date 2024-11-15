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
  const [activeEntity, setActiveEntity] = useState("Users"); // Tracks current entity
  const [entitiesData, setEntitiesData] = useState({
    Users: [],
    IngoingInvoice: [],
    OutgoingInvoice: [],
    Company: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formValues, setFormValues] = useState({}); // Form values for Edit

  const entityFields = {
    Users: { email: "", firstName: "", lastName: "", role: "" },
    IngoingInvoice: { invoiceNumber: "", invoiceDate: "", invoiceTotal: "" },
    OutgoingInvoice: { invoiceNumber: "", invoiceDate: "", invoiceTotal: "" },
    Company: { companyName: "", orgNumber: "", address: "", taxId: "" },
  };

  // Fetch data for the active entity
  const fetchEntityData = async (entity) => {
    setIsLoading(true);
    try {
      let response;
      if (entity === "Users") {
        response = await axios.get("/api/User/all");
      } else if (entity === "IngoingInvoice") {
        response = await axios.get("/api/IngoingInvoice/all");
      } else if (entity === "OutgoingInvoice") {
        response = await axios.get("/api/OutgoingInvoice/all");
      } else if (entity === "Company") {
        response = await axios.get("/api/Company/getUserCompanies");
      }
      console.log(response.data); // Debugging the response
      setEntitiesData((prev) => ({ ...prev, [entity]: response.data || [] }));
    } catch (error) {
      console.error(`Failed to fetch ${entity}:`, error);
      setError(`Failed to fetch ${entity}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntityData(activeEntity);
  }, [activeEntity]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Update (PUT or PATCH)
  const handleUpdate = async () => {
    try {
      if (!selectedItem) return;

      if (activeEntity === "Users") {
        await axios.put(`/api/User/edit`, { ...selectedItem, ...formValues });
      } else if (activeEntity === "IngoingInvoice") {
        await axios.put(`/api/IngoingInvoice/update/${selectedItem.id}`, { ...selectedItem, ...formValues });
      } else if (activeEntity === "OutgoingInvoice") {
        await axios.put(`/api/OutgoingInvoice/update/${selectedItem.id}`, { ...selectedItem, ...formValues });
      } else if (activeEntity === "Company") {
        await axios.patch(`/api/Company/${selectedItem.id}`, { ...selectedItem, ...formValues });
      }
      setIsDialogOpen(false);
      fetchEntityData(activeEntity); // Refresh the data
    } catch (error) {
      setError(`Failed to update ${activeEntity}: ${error.message}`);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      if (activeEntity === "Users") {
        await axios.delete(`/api/User/delete/${id}`);
      } else if (activeEntity === "IngoingInvoice") {
        await axios.delete(`/api/IngoingInvoice/delete/${id}`);
      } else if (activeEntity === "OutgoingInvoice") {
        await axios.delete(`/api/OutgoingInvoice/delete/${id}`);
      } else if (activeEntity === "Company") {
        await axios.delete(`/api/Company/${id}`);
      }
      fetchEntityData(activeEntity); // Refresh the data
    } catch (error) {
      setError(`Failed to delete ${activeEntity}: ${error.message}`);
    }
  };

  // Open dialog for Edit
  const openDialog = (item = null) => {
    setSelectedItem(item);
    setFormValues(item || entityFields[activeEntity]);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="Users" onValueChange={setActiveEntity} className="w-full">
        <TabsList className="flex w-min justify-start">
          <TabsTrigger value="Users" className="font-semibold">
            Users
          </TabsTrigger>
          <TabsTrigger value="IngoingInvoice" className="font-semibold">
            Ingående Fakturor
          </TabsTrigger>
          <TabsTrigger value="OutgoingInvoice" className="font-semibold">
            Utgående Fakturor
          </TabsTrigger>
          <TabsTrigger value="Company" className="font-semibold">
            Företag
          </TabsTrigger>
        </TabsList>

        {/* Entity Tab Content */}
        {Object.keys(entitiesData).map((entity) => (
          <TabsContent key={entity} value={entity} className="h-full w-full">
            <Card>
              <CardHeader>
                <CardTitle>{entity}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <thead>
                    <tr>
                      {Object.keys(entityFields[entity]).map((field) => (
                        <th key={field}>{field}</th>
                      ))}
                      <th>Åtgärder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(entitiesData[entity]) ? entitiesData[entity] : []).map((item) => (
                      <tr key={item.id}>
                        {Object.keys(entityFields[entity]).map((field) => (
                          <td key={field}>{item[field]}</td>
                        ))}
                        <td>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(item)}
                          >
                            Redigera
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="ml-2"
                          >
                            Radera
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog for Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Redigera {activeEntity}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.keys(entityFields[activeEntity]).map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{field}</Label>
                <Input
                  id={field}
                  name={field}
                  value={formValues[field] || ""}
                  onChange={handleInputChange}
                  placeholder={`Skriv ${field}`}
                />
              </div>
            ))}
          </div>
          <Button onClick={handleUpdate} className="w-full">
            Spara
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
