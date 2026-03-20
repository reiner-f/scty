import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Modal } from "../common/Modal";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Textarea } from "../common/Textarea";
import { Checkbox } from "../common/Checkbox";
import { Button } from "../common/Button";
import { Request } from "@/types";
import { useApp } from "@/context/AppContext";
import { getCurrentDate } from "@/utils/helpers";

interface EditRequestModalProps {
  request: Request | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Request>) => Promise<void>;
}

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

export function EditRequestModal({ request, isOpen, onClose, onSave }: EditRequestModalProps) {
  const { providers, services, notifySuccess, notifyError } = useApp();
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

  useEffect(() => {
    if (request && isOpen) {
      setFormData({
        title: request.title,
        description: request.description,
        serviceId: request.serviceId,
        providerId: request.providerId,
        hasEstimatedDate: !!request.estimatedStartDate,
        estimatedStartDate: request.estimatedStartDate || "",
      });
      setErrors({});
    }
  }, [request, isOpen]);

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
    
    // Curățăm eroarea de pe dată dacă utilizatorul debifează căsuța
    if (!checked && errors.estimatedStartDate) {
      setErrors((prev) => ({ ...prev, estimatedStartDate: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = "Titlul cererii este obligatoriu";
    if (!formData.description.trim()) newErrors.description = "Descrierea cererii este obligatorie";
    if (!formData.serviceId) newErrors.serviceId = "Selectați un serviciu";
    if (!formData.providerId) newErrors.providerId = "Selectați un furnizor";
    if (formData.hasEstimatedDate && !formData.estimatedStartDate) {
      newErrors.estimatedStartDate = "Selectați data estimată de început";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !request) {
      notifyError("Vă rugăm să corectați erorile din formular.");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedService = services.find((s) => s.id === formData.serviceId);
      const selectedProvider = providers.find((p) => p.id === formData.providerId);

      await onSave(request.id, {
        title: formData.title,
        description: formData.description,
        serviceId: formData.serviceId,
        serviceName: selectedService?.name || "",
        providerId: formData.providerId,
        providerName: selectedProvider?.name || "",
        providerCui: selectedProvider?.cui || "",
        estimatedStartDate: formData.hasEstimatedDate ? formData.estimatedStartDate : undefined,
      });

      notifySuccess("Cererea a fost actualizată cu succes!");
      onClose();
    } catch {
      notifyError("A apărut o eroare la actualizarea cererii.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!request) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editare Cerere" size="lg" preventOutsideClick>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Input
          label="Titlu Cerere"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ex: Colectare deșeuri Sector 3"
          error={errors.title}
          disabled={isSubmitting}
        />

        <Textarea
          label="Descriere Cerere"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descrieți în detaliu serviciul solicitat..."
          error={errors.description}
          rows={4}
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Select
            label="Serviciu Solicitat"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            options={serviceOptions}
            placeholder="Selectați serviciul"
            error={errors.serviceId}
            disabled={isSubmitting}
          />

          <Select
            label="Furnizor"
            name="providerId"
            value={formData.providerId}
            onChange={handleChange}
            options={providerOptions}
            placeholder="Selectați furnizorul"
            error={errors.providerId}
            disabled={isSubmitting}
          />
        </div>

        {/* Zona interactivă pentru dată, transformată într-un panou curat */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 transition-colors">
          <Checkbox
            checked={formData.hasEstimatedDate}
            onChange={handleCheckboxChange}
            disabled={isSubmitting}
            label="Planificare Dată"
            description="Specifică data la care ar trebui să înceapă prestarea serviciului (Opțional)."
          />

          {/* Animație fluidă pentru afișarea câmpului de dată */}
          <AnimatePresence>
            {formData.hasEstimatedDate && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-slate-200">
                  <Input
                    type="date"
                    name="estimatedStartDate"
                    value={formData.estimatedStartDate}
                    onChange={handleChange}
                    min={getCurrentDate()}
                    error={errors.estimatedStartDate}
                    disabled={isSubmitting}
                    leftIcon={<Calendar className="w-4 h-4" />}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer-ul cu acțiuni */}
        <div className="flex items-center justify-end gap-3 pt-2 mt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Anulează
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Salvează Modificările
          </Button>
        </div>
      </form>
    </Modal>
  );
}