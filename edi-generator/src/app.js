import $ from 'jquery';

$(document).ready(function () {
    let itemCount = 1;

    $('#add-item').click(function () {
        itemCount++;
        const newItem = `
              <tr class="bg-white">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input type="text" id="quantity${itemCount}" name="quantity[]" required
                    class="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 block w-full sm:text-sm"
                    placeholder="Quantidade">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <input type="text" id="description${itemCount}" name="description[]" required
                    class="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 block w-full sm:text-sm"
                    placeholder="Descrição">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <input type="text" id="unit-price${itemCount}" name="unit-price[]" required
                    class="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 block w-full sm:text-sm"
                    placeholder="Preço Unitário">
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button type="button" class="text-red-600 hover:text-red-900 delete-item">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            `;
        $('#items tbody').append(newItem);
    });

    $(document).on('click', '.delete-item', function () {
        $(this).closest('tr').remove();
    });

    window.removeItem = function (button) {
        $(button).closest('tr').remove();
    };

    $('#edi-form').submit(function (event) {
        event.preventDefault();
        const formData = $(this).serializeArray();
        const items = [];
    
        $('#items tbody tr').each(function (index) {
            const quantity = $(this).find('input[name="quantity[]"]').val();
            const description = $(this).find('input[name="description[]"]').val();
            const unitPrice = $(this).find('input[name="unit-price[]"]').val();
            const total = (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2).toString()
            items.push({ quantity, description, unitPrice, total });
        });
    
        const edi = formatEDI(formData, items);
        saveEDI(edi);
    });
    
    function formatEDI(formData, items) {
        let edi = '';
    
        const noteType = formData.find(item => item.name === 'note-type').value;
        const invoiceNumber = formData.find(item => item.name === 'invoice-number').value;
        const date = formData.find(item => item.name === 'date').value.replaceAll('-', '');
        const vendorName = $('#vendor-name').val();
        const vendorAddress = $('#vendor-address').val();
        const vendorCity = $('#vendor-city').val();
        const vendorPhone = $('#vendor-phone').val();
        const vendorCpfCnpj = $('#vendor-cpf-cnpj').val();
        const customerName = $('#customer-name').val();
        const customerAddress = $('#customer-address').val();
        const customerCity = $('#customer-city').val();
        const customerPhone = $('#customer-phone').val();
        const customerCpfCnpj = $('#customer-cpf-cnpj').val();
    
        edi += `ST*850*${noteType}\n`;
        edi += `BG*${invoiceNumber}*${date}\n`;
        edi += `N1*${vendorName}*${vendorAddress}*${vendorCity}*${vendorPhone}*${vendorCpfCnpj}\n`;
        edi += `N2*${customerName}*${customerAddress}*${customerCity}*${customerPhone}*${customerCpfCnpj}\n`;
    
        items.forEach((item, index) => {
            const lineNumber = index + 1;
            edi += `PO${lineNumber}*${item.quantity}*${item.description}*${item.unitPrice}*${item.total}\n`;
        });
    
        const totalItems = items.reduce((acc, item) => acc + parseFloat(item.quantity), 0)
        const totalValue = items.reduce((acc, item) => acc + parseFloat(item.total), 0).toFixed(2);
        edi += `CTT*${totalItems}*${totalValue}\n`;
    
        edi += `SE*${invoiceNumber}\n`;
    
        return edi;
    }
    
    function saveEDI(edi) {
        downloadFile(edi, 'documento.txt', 'text/plain');
    }
    
    function downloadFile(content, filename, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], { type: contentType });
    
        a.href = URL.createObjectURL(file);
        a.download = filename;
        a.click();
    
        URL.revokeObjectURL(a.href);
    }
});
