import React, { forwardRef, useEffect, useState } from "react";
import Barcode from "react-barcode";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  origin: string;
  destination: string;
  quantity: number;
  weight: number;
  volumeWeight: number;
  sender: {
    name: string;
    address: string;
    phone: string;
    email?: string;
  };
  receiver: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  details: {
    itemType: string;
    shippingCost: number;
  };
  statusHistory: any[];
  currentStatus: string;
  createdAt: string;
}

interface PrintTemplateProps {
  data: ReceiptData | null;
}

export const PrintTemplate = forwardRef<HTMLDivElement, PrintTemplateProps>(
  ({ data }, ref) => {
    const [contacts, setContacts] = useState<any>(null);

    useEffect(() => {
      async function loadContacts() {
        try {
          const snap = await getDoc(doc(db, "content", "contacts"));
          if (snap.exists()) {
            setContacts(snap.data());
          }
        } catch (err) {
          console.error("Failed to fetch contacts", err);
        }
      }
      loadContacts();
    }, []);

    if (!data) return null;

    // Formatting date
    const formattedDate = new Date(data.date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "decimal",
        minimumFractionDigits: 2,
      }).format(amount);
    };

    return (
      <div ref={ref} className="p-8 bg-white text-black font-sans print:p-0">
        <style type="text/css" media="print">
          {`
            @page { size: landscape; margin: 10mm; }
            * { color: black !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          `}
        </style>
        
        {/* Header Section */}
        <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
          <div className="flex items-center gap-4">
             <img src="/logo/jnt-logo.jpg" alt="Logo" className="w-24 h-auto" />
          </div>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-black uppercase tracking-wide">J&T Express Magelang</h1>
            <p className="text-[10px] mt-1 space-x-2">
              <span>WA: {contacts?.phone || "0811-234-5678"}</span>
              <span>•</span>
              <span>Telepon: {contacts?.phone || "0811-234-5678"}</span>
              <span>•</span>
              <span className="block mt-0.5">Alamat: {contacts?.address || "Jl. Jenderal Sudirman No. 123, Magelang"}</span>
            </p>
          </div>
          <div className="flex flex-col items-end">
            <Barcode 
              value={data.receiptNumber} 
              width={1.5} 
              height={50} 
              fontSize={14} 
              margin={0}
              displayValue={true} 
            />
          </div>
        </div>

        {/* Data Tabel */}
        <div className="w-full text-sm">
          {/* Row 1 */}
          <div className="grid grid-cols-7 gap-2 mb-4 font-bold">
            <div>No.Resi</div>
            <div>Tanggal</div>
            <div>Asal</div>
            <div>Tujuan</div>
            <div>Jml. Barang</div>
            <div>Berat (kg)</div>
            <div>Berat Volume</div>
          </div>
          <div className="grid grid-cols-7 gap-2 border-b border-black pb-4 mb-4">
            <div>{data.receiptNumber}</div>
            <div>{formattedDate}</div>
            <div>{data.origin}</div>
            <div>{data.destination}</div>
            <div>{data.quantity}</div>
            <div>{data.weight}</div>
            <div>{data.volumeWeight}</div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-5 gap-2 font-bold mb-1">
            <div className="col-span-1">Pengirim</div>
            <div className="col-span-1">Alamat Pengirim</div>
            <div className="col-span-1">Penerima</div>
            <div className="col-span-1">Biaya Pengiriman</div>
            <div className="col-span-1">Jenis Barang</div>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-4">
            <div className="col-span-1 uppercase pr-2">{data.sender.name}</div>
            <div className="col-span-1 text-xs pr-4">{data.sender.address}</div>
            <div className="col-span-1 pr-4 whitespace-pre-wrap uppercase">
              {data.receiver.name}
              {"\n"}
              <span className="text-xs normal-case">{data.receiver.address}</span>
            </div>
            <div className="col-span-1">{formatCurrency(data.details.shippingCost)}</div>
            <div className="col-span-1 text-xs">{data.details.itemType}</div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-4 gap-2 font-bold mb-1 mt-4">
            <div>Telepon Pengirim</div>
            <div>Email Pengirim</div>
            <div>Telepon Penerima</div>
            <div>Email Penerima</div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-8">
            <div>{data.sender.phone}</div>
            <div>{data.sender.email || "-"}</div>
            <div>{data.receiver.phone}</div>
            <div>{data.receiver.email || "-"}</div>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-12 grid grid-cols-3 gap-8 text-sm font-bold">
          <div className="flex flex-col gap-12">
            <div>Tanda Tangan Pengirim</div>
            <div className="border-t border-black pt-1 w-[80%] uppercase">{data.sender.name}</div>
          </div>
          <div className="flex flex-col gap-12">
            <div>Tanda Tangan Petugas</div>
            <div className="border-t border-black pt-1 w-[80%] uppercase">ADMIN</div>
          </div>
          <div className="flex flex-col gap-4">
            <div>Tanda Tangan Penerima</div>
            <div className="h-10"></div>
            <div className="border-t border-black pt-1 w-[80%]">Nama Penerima : <br/><br/><br/>HP Penerima :</div>
          </div>
        </div>

      </div>
    );
  }
);

PrintTemplate.displayName = "PrintTemplate";
