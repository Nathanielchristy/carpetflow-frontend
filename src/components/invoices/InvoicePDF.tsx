import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { Invoice } from '../../types'; // adjust import path accordingly

// Optional: register fonts if needed
// Font.register({ family: 'Roboto', src: '/path-to-font.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  invoiceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: '#eee',
    padding: 4,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 4,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalsLabel: {
    width: '50%',
    fontWeight: 'bold',
    paddingRight: 10,
    textAlign: 'right',
  },
  totalsValue: {
    width: '20%',
    textAlign: 'right',
  },
  footer: {
    marginTop: 20,
    fontSize: 9,
    color: 'gray',
    textAlign: 'center',
  },
});

type InvoicePDFProps = {
  invoice: Invoice;
};

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString();
  };

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.header}>Invoice</Text>
          <View style={styles.invoiceInfoRow}>
            <Text>
              <Text style={styles.label}>Invoice No: </Text>
              {invoice.invoiceNumber}
            </Text>
            <Text>
              <Text style={styles.label}>Date: </Text>
              {formatDate(invoice.createdAt)}
            </Text>
          </View>
          <View style={styles.invoiceInfoRow}>
            <Text>
              <Text style={styles.label}>Status: </Text>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.label}>Bill To:</Text>
          <Text>{invoice.customer.name}</Text>
          <Text>{invoice.customer.email}</Text>
          <Text>{invoice.customer.phone}</Text>
          <Text>{invoice.customer.address}</Text>
          <Text>{invoice.customer.city}</Text>
          {invoice.customer.taxNumber && (
            <Text>Tax Number: {invoice.customer.taxNumber}</Text>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Item</Text>
            <Text style={styles.tableColHeader}>Qty</Text>
            <Text style={styles.tableColHeader}>Unit Price</Text>
            <Text style={styles.tableColHeader}>Total</Text>
          </View>

            {invoice.items.map((item) => (
            <View style={styles.tableRow} key={item.id}>
                <Text style={styles.tableCol}>{item.carpet.name}</Text>
                <Text style={styles.tableCol}>{item.quantity}</Text>
                <Text style={styles.tableCol}>{(item.unitPrice || 0).toFixed(2)}</Text>
                <Text style={styles.tableCol}>{(item.total || 0).toFixed(2)}</Text>
            </View>
            ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Subtotal:</Text>
          <Text style={styles.totalsValue}>{(invoice.subtotal || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Discount ({invoice.discountPercentage || 0} %):</Text>
          <Text style={styles.totalsValue}>{(invoice.discountAmount || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Tax ({invoice.taxPercentage || 0} %):</Text>
          <Text style={styles.totalsValue}>{(invoice.taxAmount || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.totalsRow}>
          <Text style={[styles.totalsLabel, { fontSize: 13 }]}>Total:</Text>
          <Text style={[styles.totalsValue, { fontSize: 13 }]}>
            {(invoice.total || 0).toFixed(2)}
          </Text>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={[styles.section, { marginTop: 15 }]}>
            <Text style={styles.label}>Notes:</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>CarpetsFlow</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
