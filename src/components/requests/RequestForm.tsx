import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Calendar, Building, Briefcase, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Textarea } from "../common/Textarea";
import { Checkbox } from "../common/Checkbox";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { useApp } from "@/context/AppContext";
import { getCurrentDate } from "@/utils/helpers";

interface FormData {
  title: string;
  description: string;
  serviceId: string;
  providerId: string;
  hasEstimatedDate: boolean;
  estimatedStartDate: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  serviceId?: string;
  providerId?: string;
  estimatedStartDate?: string;
}

export function RequestForm() {
  const navigate = useNavigate();
  const { 
    municipality, 
    addRequest, 
    notifySuccess, 
    notifyError,
    providers,
    services,
    isLoadingProviders,
    isLoadingServices
  } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    serviceId: "",
    providerId: "",
    hasEstimatedDate: false,
    estimatedStartDate: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [providerCui, setProviderCui] = useState("");

  useEffect(() => {
    if (formData.providerId) {
      const provider = providers.find((p) => p.id === formData.providerId);
      setProviderCui(provider?.cui || "");
    } else {
      setProviderCui("");
    }
  }, [formData.providerId, providers]);

  const serviceOptions = services.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const providerOptions = providers.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      hasEstimatedDate: checked,
      estimatedStartDate: checked ? prev.estimatedStartDate : "",
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Titlul cererii este obligatoriu";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrierea cererii este obligatorie";
    }

    if (!formData.serviceId) {
      newErrors.serviceId = "Selectați un serviciu";
    }

    if (!formData.providerId) {
      newErrors.providerId = "Selectați un furnizor";
    }

    if (formData.hasEstimatedDate && !formData.estimatedStartDate) {
      newErrors.estimatedStartDate = "Selectați data estimată de început";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      notifyError("Vă rugăm să completați toate câmpurile obligatorii");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedService = services.find((s) => s.id === formData.serviceId);
      const selectedProvider = providers.find((p) => p.id === formData.providerId);

      await addRequest({
        title: formData.title,
        description: formData.description,
        status: "pending",
        municipalityId: municipality.id,
        municipality: {
          name: municipality.name,
          cui: municipality.cui,
          locality: municipality.locality
        },
        contactPerson: municipality.contactPerson,
        locality: municipality.locality,
        serviceId: formData.serviceId,
        service: { 
          name: selectedService?.name || "" 
        },
        providerId: formData.providerId,
        provider: { 
          name: selectedProvider?.name || "", 
          cui: selectedProvider?.cui || "" 
        },
        estimatedStartDate: formData.hasEstimatedDate
          ? formData.estimatedStartDate
          : undefined,
      });

      notifySuccess("Cererea a fost creată cu succes!");
      navigate("/");
    } catch {
      notifyError("A apărut o eroare. Vă rugăm să încercați din nou.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingProviders || isLoadingServices;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-baby-dark" />
        <span className="ml-3 text-lg text-primary-600">Se încarcă datele...</span>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary-100">
          <div className="w-10 h-10 rounded-xl bg-baby-lighter flex items-center justify-center">
            <Building className="w-5 h-5 text-baby-dark" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-900">Date Primărie</h3>
            <p className="text-lg text-primary-500">Completate automat</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Denumire Primărie"
            value={municipality.name}
            disabled
          />
          <Input
            label="CUI Primărie"
            value={municipality.cui}
            disabled
          />
          <Input
            label="Persoană de Contact"
            value={municipality.contactPerson.name}
            disabled
          />
          <Input
            label="Email Contact"
            value={municipality.contactPerson.email}
            disabled
          />
          <Input
            label="Telefon Contact"
            value={municipality.contactPerson.phone}
            disabled
          />
          <Input
            label="Localitate"
            value={municipality.locality}
            disabled
          />
          <Input
            label="Data Cererii"
            value={getCurrentDate()}
            disabled
            leftIcon={<Calendar className="w-4 h-4" />}
          />
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary-100">
          <div className="w-10 h-10 rounded-xl bg-baby-lighter flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-baby-dark" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-900">Detalii Cerere</h3>
            <p className="text-lg text-primary-500">Completați informațiile despre cerere</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Titlu Cerere *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Colectare deșeuri Sector 3"
            error={errors.title}
          />

          <Textarea
            label="Descriere Cerere *"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrieți în detaliu serviciul solicitat..."
            error={errors.description}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Serviciu Solicitat *"
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              options={serviceOptions}
              placeholder="Selectați serviciul"
              error={errors.serviceId}
            />

            <Select
              label="Furnizor *"
              name="providerId"
              value={formData.providerId}
              onChange={handleChange}
              options={providerOptions}
              placeholder="Selectați furnizorul"
              error={errors.providerId}
            />
          </div>

          {providerCui && (
            <Input
              label="CUI Furnizor"
              value={providerCui}
              disabled
            />
          )}

          <div className="pt-4 border-t border-primary-100">
            <div className="flex items-start gap-3">
              <Checkbox
                id="hasEstimatedDate"
                checked={formData.hasEstimatedDate}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="hasEstimatedDate" className="cursor-pointer">
                <span className="text-lg font-medium text-primary-900">
                  Adaugă dată estimată de început
                </span>
                <p className="text-lg text-primary-500 mt-0.5">
                  Opțional - specificați când doriți să înceapă serviciul
                </p>
              </label>
            </div>

            {formData.hasEstimatedDate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <Input
                  label="Data Estimată de Început *"
                  type="date"
                  name="estimatedStartDate"
                  value={formData.estimatedStartDate}
                  onChange={handleChange}
                  min={getCurrentDate()}
                  error={errors.estimatedStartDate}
                  leftIcon={<Calendar className="w-4 h-4" />}
                />
              </motion.div>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/")}
        >
          Anulează
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          rightIcon={<Send className="w-4 h-4" />}
        >
          Trimite Cererea
        </Button>
      </div>
    </motion.form>
  );
}
