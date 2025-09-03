import { fullPaymentConfirmationTemplate } from 'src/sections/email-templates/email-confirmation';
import { partialPaymentTemplate } from 'src/sections/email-templates/email-confirmation';

export default function EmailPreviewPage() {
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
        startType: 'Confirmed Start Date', // <-- added field
        startWith: 'Lunch',                // <-- added field
        subtotal: '38.00',
        discount: '5.00',
        tax: '3.14',
        total: '38.00',
        supportEmail: 'confinement@chillipadi.com.sg'
    });
    // const html = partialPaymentTemplate({
    //     kitchenAddress: 'Blk 3015 Bedok North Street 5 #04-19<br/>Shimei East Kitchen<br/>Singapore 486350',
    //     date: '27/08/2025',
    //     confirmationNo: 'CPC-13699',
    //     uen: '200301089E',
    //     delivery: {
    //         name: 'Jen Chang',
    //         contact: '+6591779126',
    //         address: '322B Anchorvale Drive #11-130<br/>Singapore 542322<br/>Singapore'
    //     },
    //     items: [
    //         {
    //             quantity: 1,
    //             name: '21 Days Dual Meal',
    //             dateSelected: '02-09-2025',
    //             gst: '$3.14 GST',
    //             price: '1,368.00'
    //         }
    //     ],
    //     startType: 'Confirmed Start Date',
    //     startWith: 'Lunch',
    //     subtotal: '1,368.00',
    //     discount: '0.00',
    //     tax: '3.14',
    //     shipping: '0.00',
    //     total: '1,368.00',
    //     amountPaid: '100.00',
    //     outstanding: '1,268.00',
    //     supportEmail: 'confinement@chillipadi.com.sg'
    // });
    return (
        <div dangerouslySetInnerHTML={{ __html: html }} />
    );
}