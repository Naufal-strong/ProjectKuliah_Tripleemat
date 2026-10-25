import type { Metadata } from "next";
import React from "react";
import FormMasuk from "@/components/FormMasuk";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { PageHeader } from "@/src/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Masuk Sesi Audit | Tripleemat Security Assessor",
  description: "Masuk ke sesi auditor untuk melakukan pemindaian keamanan dan pendaftaran target audit.",
};

export default function HalamanMasuk() {
  return (
    <main
      id="main-content"
      className="flex-1 w-full max-w-md mx-auto px-4 py-12 sm:py-20 flex flex-col justify-center"
    >
      <PageHeader
        title="Masuk Sesi Audit"
        eyebrow="Autentikasi Auditor"
        description="Gunakan akun pengelola atau akun demo praktikum untuk mengakses hak pemindaian."
      />

      <Card variant="default">
        <CardHeader>
          <CardTitle as="h2" className="text-lg">
            Kredensial Sesi
          </CardTitle>
          <CardDescription>
            Cookie sesi akan dipasang dengan atribut HttpOnly, SameSite=Lax, dan Max-Age 8 jam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormMasuk />
        </CardContent>
      </Card>
    </main>
  );
}
