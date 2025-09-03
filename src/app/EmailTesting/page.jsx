"use client";
import React from "react";
import { fullPaymentConfirmationTemplate } from "src/sections/email-templates/email-confirmation";

export default function EmailTesting() {
    const handleClick = async () => {
        // Generate the email HTML using your template
        const html = fullPaymentConfirmationTemplate({
            kitchenAddress: 'Blk 3015 Bedok North Street 5 #04-19<br/>Shimei East Kitchen<br/>Singapore 486350',
            date: '27/08/2025',
            confirmationNo: 'CPC-13699',
            uen: '200301089E',
            delivery: {
                name: 'Jen Chang',
                contact: '+6591779126',
                address: '322B Anchorvale Drive #11-130<br/>Singapore 542322<br/>Singapore'
            },
            items: [
                {
                    quantity: 1,
                    name: 'Trial Meal - Dinner',
                    dateSelected: '02-09-2025',
                    gst: '$3.14 GST',
                    price: '38.00'
                }
            ],
            startType: 'Confirmed Start Date',
            startWith: 'Lunch',
            subtotal: '38.00',
            discount: '5.00',
            tax: '3.14',
            total: '38.00',
            supportEmail: 'confinement@chillipadi.com.sg'
        });

        const res = await fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: "ellisemarimon@chilliapi.com.sg",
                subject: "Order Confirmation",
                html, // use the generated template here
            }),
        });
        const data = await res.json();
        if (data.success) {
            alert("Email sent!");
        } else {
            alert("Failed to send email: " + data.error);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Email Testing Page</h1>
            <button onClick={handleClick}>Send Test Email</button>
        </div>
    );
}