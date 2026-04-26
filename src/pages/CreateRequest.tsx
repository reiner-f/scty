import React from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RequestForm } from "@/components/requests/RequestForm";
import { Button } from "@/components/common/Button";

export function CreateRequest() {
  return (
    <div id="centria_create-request" className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4"
      >
        <Link to="/">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Înapoi
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Cerere Nouă</h1>
          <p className="text-lg text-primary-600 mt-1">
            Completează formularul pentru a crea o cerere nouă
          </p>
        </div>
      </motion.div>

      <RequestForm />
    </div>
  );
}