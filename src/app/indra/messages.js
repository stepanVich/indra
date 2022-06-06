const resources = {
  en: {
    // root
    'account.loggedIn': 'Logged in:',
    'lang.button.cz': 'CZ',
    'lang.button.en': 'EN',
    'currency.czk': 'CZK',
    'currency.eur': 'EUR',
    yes: 'Yes',
    no: 'No',
    // appMenu
    'menu.home': 'Home',
    'menu.BM': 'BT',
    'menu.DM': 'DT',
    'menu.reports': 'Reports',
    'menu.system': 'System',
    'menu.others': 'Others',
    // layoutController
    'layout.loading': 'Loading layout...',
    'layout.error.render': 'Unable to render layout: %p1%',
    'layout.error.definition': 'Unable to read layout definition: %p1%',
    'layout.error.undefined': 'Undefined layout!',
    'layout.settings.button.ok': 'OK',
    // newPanelModal
    'newPanel.title': 'Add panel:',
    'newPanel.folder.BM': 'BM',
    'newPanel.folder.DM': 'DM',
    'newPanel.folder.reports': 'Reports',
    'newPanel.folder.graphs': 'Graphs',
    'newPanel.folder.RRD': 'RRD',
    'newPanel.newBM': 'Order creation BM',
    'newPanel.newDM': 'Order creation DM',
    'newPanel.ownOrders': 'Own orders',
    'newPanel.bidsByDeliveryDay': 'Bids by delivery day',
    'newPanel.DMPosition': 'Business position DM',
    'newPanel.DMResults': 'DM results',
    'newPanel.overview': 'Trading overview',
    'newPanel.RRDByDelivery': 'RRD by trading day',
    // dynamicLayout
    'dynamicLayout.button.add': 'Add New Panel',
    // otherPanels
    'otherPanels.button.send': 'Send Data',
    // grid
    'grid.loading': 'Loading grid...',
    'grid.error.columns': 'Grid has no columns defined!',
    'grid.filtration.search': 'Search',
    'grid.pagination.rowCount': 'Entries displayed: %p1%',
    'grid.pagination.rowCountFiltered': 'Total entries: %p1%, displayed: %p2%',
    'grid.pagination.page': 'Page:',
    'grid.pagination.pageOf': 'of',
    'grid.pagination.goToPage': 'Go to page:',
    'grid.options.title': 'Display:',
    // form
    'form.title.header': 'Header data:',
    'form.title.detail': 'Detail data',
    // rrd
    'rrd.deliveryDay': 'Delivery day:*',
    'rrd.transportType': 'Transport type:*',
    'rrd.matchingPeriodStart': 'Matching period start:*',
    'rrd.processingType': 'Processing type:*',
    'rrd.owner': 'Owner:*',
    'rrd.sender': 'Sender:*',
    'rrd.counterparty': 'Counterparty:*',
    // ---
    'rrd.detail.realize': 'Realize',
    'rrd.detail.direction': 'Direction',
    'rrd.detail.direction.buy': 'Buy',
    'rrd.detail.direction.sell': 'Sell',
    'rrd.detail.diagram.id': 'Diagram id',
    'rrd.detail.diagram.version': 'Diagram version',
    'rrd.detail.index': 'Index',
    'rrd.detail.time': 'Time',
    'rrd.detail.quantity': 'Quantity',
    // ---
    'rrd.button.new': 'New RRD',
    // order
    'order.type.standard': 'Standard',
    'order.type.block': 'Block',
    'order.id': 'Order id:',
    'order.version': 'Version:',
    'order.deliveryDay': 'Delivery day:*',
    'order.participant': 'Participant:*',
    'order.currency': 'Settlement currency code:*',
    'order.implicitCurrency': 'Implicit settlement currency code:*',
    'order.category': 'Category:*',
    'order.category.PBN': 'PBN',
    'order.category.FHN': 'FHN',
    'order.type': 'Type:*',
    'order.type.buy': 'Buy',
    'order.type.sell': 'Sell',
    'order.comment': 'Comment:',
    'order.exclusiveGroup': 'Exclusive group:',
    'order.exclusiveGroupId': 'Exclusive group id:*',
    'order.financeChange': 'Check for financial security:*',
    'order.financeChange.immediately': 'Immediately',
    'order.financeChange.anotherTime': 'Another time',
    // ---
    'order.detail.product': 'Product',
    'order.detail.minPercent': 'Min %*',
    'order.detail.comment': 'Comment',
    'order.detail.priceQty': 'Price (Eur/MWh)*',
    'order.detail.segment': 'Segment %p1%',
    'order.detail.index': 'Index',
    'order.detail.time': 'Time',
    'order.detail.quantity': 'Quantity',
    'order.detail.price': 'Price',
    'order.detail.fhn.comment': 'Comment',
    'order.detail.fhn.price': 'Price',
    'order.detail.fhn.priceUnit': '(Eur/MWh)',
    'order.detail.fhn.quantity': 'Quantity',
    'order.detail.fhn.quantityUnit': '(MWh)',
    // ---
    'order.button.ok': 'OK',
    'order.button.send': 'Send Order',
    'order.button.modify': 'Modify Order',
    'order.button.create': 'Create Order',
    'order.button.delete': 'Delete Order',
    'order.button.upload': 'Upload',
    'order.message.modified': 'Successful order modification.',
    'order.message.created': 'Successful order creation.',
    'order.message.deleted': 'Successful order annulation.',
    'order.validation.qtyPrice': 'Enter quantity and price.',
    // graph
    'graph.loading': 'Loading graph...',
    'graph.price': 'Price',
    'graph.quantity': 'Quantity',
    'graph.unit.price': '[Euro]',
    'graph.unit.quantity': '[MW]',
    'graph.buy': 'Buy',
    'graph.sell': 'Sell',
    // format
    'format.date': 'dd.MM.yyyy',
    'format.date.moment': 'DD.MM.yyyy',
    'format.dateTime.moment': 'DD.MM.YYYY HH:mm:ss',
    'format.time.hourMinutes': 'HH:mm',
    // db layout
    'layout.grid.RDList': 'List of RD',
    'layout.form.RRD': 'New RRD',
    'layout.grid.DMOverview': 'Daily market - overview',
    'layout.grid.ownOrders': 'Own orders @deliveryDate@',
    'layout.grid.bidsByDeliveryDay': 'Bids by delivery day',
    'layout.graph.DMPosition': 'DM trading position @deliveryDate@',
    'layout.graph.DMResults': 'DM results @deliveryDate@',
    'layout.form.order': 'New order / order modification',
    // db grid
    'grid.label.docId': 'DocId',
    'grid.label.idDgm': 'IdDgm',
    'grid.label.ver': 'Ver',
    'grid.label.anomalyReason': 'Anomaly reason',
    'grid.label.RDVol': 'RDVol',
    'grid.label.SSSell': 'SS Sell',
    'grid.label.seller': 'Seller',
    'grid.label.buyer': 'Buyer',
    'grid.label.sender': 'Sender',
    // ---
    'grid.label.session': 'Session',
    'grid.label.deliveryDate': 'Delivery date',
    'grid.label.deadline': 'Deadline',
    'grid.label.status': 'Status',
    'grid.label.spotMarketIndex': 'SPOT MARKET INDEX (EUR/MWh)',
    'grid.label.baseLoad': 'BASE LOAD',
    'grid.label.peakLoad': 'PEAK LOAD',
    'grid.label.offPeakLoad': 'OFFPEAK LOAD',
    'grid.label.prices': 'Prices',
    'grid.label.minPrice': 'Min Price',
    'grid.label.maxPrice': 'Max Price',
    // ---
    'grid.label.bidId': 'Bid id',
    'grid.label.bidVersion': 'Bid version',
    'grid.label.participant': 'Participant',
    'grid.label.type': 'Type',
    'grid.label.category': 'Category',
    'grid.label.deliveryDay': 'Delivery day',
    'grid.label.valid': 'Valid',
    'grid.label.replaced': 'Replaced',
    'grid.label.cancelledForDeliveryDay': 'Canc. for deliv. day',
    'grid.label.TSCancellation': 'Cancellation TS',
    'grid.label.TSSubmission': 'Submission TS',
    'grid.label.totalVolume': 'Total vol. [MWh]',
    'grid.label.minAcceptanceRatio': 'Min. acceptance ratio',
    'grid.label.minPriceEuro': 'Min. price [€/MWh]',
    'grid.label.maxPriceEuro': 'Max. price [€/MWh]',
    'grid.label.parentBlockOrderId': 'Parent block order id',
    'grid.label.exclusiveGroup': 'Exclusive group',
    'grid.label.settlementCurrency': 'Settlement currency',
    'grid.label.FSCheck': 'Check for FS',
    'grid.label.systemCancellation': 'System cancellation',
    'grid.label.system': 'System',
    'grid.label.marketType': 'Market type'
  },
  cs: {
    // root
    'account.loggedIn': 'Přihlášený:',
    'lang.button.cz': 'CZ',
    'lang.button.en': 'EN',
    'currency.czk': 'CZK',
    'currency.eur': 'EUR',
    yes: 'Ano',
    no: 'Ne',
    // appMenu
    'menu.home': 'Domů',
    'menu.BM': 'BM',
    'menu.DM': 'DM',
    'menu.reports': 'Sestavy',
    'menu.system': 'Systém',
    'menu.others': 'Ostatní',
    // layoutController
    'layout.loading': 'Načítání layoutu...',
    'layout.error.render': 'Nepodařilo se vykreslit layout: %p1%',
    'layout.error.definition': 'Nepodařilo se přečíst definici layoutu: %p1%',
    'layout.error.undefined': 'Layout není definován!',
    'layout.settings.button.ok': 'OK',
    // newPanelModal
    'newPanel.title': 'Přidat nový panel:',
    'newPanel.folder.BM': 'BT',
    'newPanel.folder.DM': 'DT',
    'newPanel.folder.reports': 'Sestavy',
    'newPanel.folder.graphs': 'Grafy',
    'newPanel.folder.RRD': 'ERD',
    'newPanel.newBM': 'Zadání nabídky BT',
    'newPanel.newDM': 'Zadání nabídky DT',
    'newPanel.ownOrders': 'Vlastní nabídky',
    'newPanel.bidsByDeliveryDay': 'Nabídky dle dne dodávky',
    'newPanel.DMPosition': 'Obchodní pozice DT',
    'newPanel.DMResults': 'Výsledky DT',
    'newPanel.overview': 'Přehled obchodování',
    'newPanel.RRDByDelivery': 'ERD dle dne dodávky',
    // dynamicLayout
    'dynamicLayout.button.add': 'Přidat nový panel',
    // otherPanels
    'otherPanels.button.send': 'Poslat data',
    // grid
    'grid.loading': 'Grid se načítá...',
    'grid.error.columns': 'Sloupce gridu nejsou definovány!',
    'grid.filtration.search': 'Hledej',
    'grid.pagination.rowCount': 'Zobrazeno záznamů: %p1%',
    'grid.pagination.rowCountFiltered': 'Celkem záznamů: %p1%, zobrazeno: %p2%',
    'grid.pagination.page': 'Stránka:',
    'grid.pagination.pageOf': 'z',
    'grid.pagination.goToPage': 'Jít na stránku:',
    'grid.options.title': 'Zobrazit:',
    // form
    'form.title.header': 'Data hlavičky:',
    'form.title.detail': 'Data detailu',
    // rrd
    'rrd.deliveryDay': 'Den dodávky:*',
    'rrd.transportType': 'Typ přenosu:*',
    'rrd.matchingPeriodStart': 'Začátek úseku párování:*',
    'rrd.processingType': 'Typ zpracování:*',
    'rrd.owner': 'Vlastník:*',
    'rrd.sender': 'Odesílatel:*',
    'rrd.counterparty': 'Protistrana:*',
    // ---
    'rrd.detail.realize': 'Realizovat',
    'rrd.detail.direction': 'Směr',
    'rrd.detail.direction.buy': 'Nákup',
    'rrd.detail.direction.sell': 'Prodej',
    'rrd.detail.diagram.id': 'Id diagramu',
    'rrd.detail.diagram.version': 'Verze diagramu',
    'rrd.detail.index': 'Index',
    'rrd.detail.time': 'Čas',
    'rrd.detail.quantity': 'Množství',
    // ---
    'rrd.button.new': 'Nový ERD',
    // order
    'order.type.standard': 'Standardní',
    'order.type.block': 'Bloková',
    'order.id': 'Id nabídky:',
    'order.version': 'Verze:',
    'order.deliveryDay': 'Den dodávky:*',
    'order.participant': 'Účastník:*',
    'order.currency': 'Kód měny vypořádání:*',
    'order.implicitCurrency': 'Kód defaultní měny vypořádání:*',
    'order.category': 'Kategorie:*',
    'order.category.PBN': 'PBN',
    'order.category.FHN': 'FHN',
    'order.type': 'Typ:*',
    'order.type.buy': 'Nákup',
    'order.type.sell': 'Prodej',
    'order.comment': 'Komentář:',
    'order.exclusiveGroup': 'Výlučná skupina:',
    'order.exclusiveGroupId': 'Id výlučné skupiny:*',
    'order.financeChange': 'Okamžik finančního zajištění:*',
    'order.financeChange.immediately': 'Ihned',
    'order.financeChange.anotherTime': 'Jindy',
    // ---
    'order.detail.product': 'Produkt',
    'order.detail.minPercent': 'Min %*',
    'order.detail.comment': 'Komentář',
    'order.detail.priceQty': 'Cena (Eur/MWh)*',
    'order.detail.segment': 'Segment %p1%',
    'order.detail.index': 'Index',
    'order.detail.time': 'Čas',
    'order.detail.quantity': 'Množství',
    'order.detail.price': 'Cena',
    'order.detail.fhn.comment': 'Komentář',
    'order.detail.fhn.price': 'Cena',
    'order.detail.fhn.priceUnit': '(Eur/MWh)',
    'order.detail.fhn.quantity': 'Množství',
    'order.detail.fhn.quantityUnit': '(MWh)',
    // ---
    'order.button.ok': 'OK',
    'order.button.send': 'Odeslat nabídku',
    'order.button.modify': 'Modifikovat nabídku',
    'order.button.create': 'Vytvořit nabídku',
    'order.button.delete': 'Anulovat nabídku',
    'order.button.upload': 'Nahrát',
    'order.message.modified': 'Úspěšná modifikace nabídky.',
    'order.message.created': 'Úspěšné zavedení nabidky.',
    'order.message.deleted': 'Úspěšná anulace nabídky.',
    'order.validation.qtyPrice': 'Zadejte množství a cenu.',
    // graph
    'graph.loading': 'Graf se načítá...',
    'graph.price': 'Cena',
    'graph.quantity': 'Množství',
    'graph.unit.price': '[Euro]',
    'graph.unit.quantity': '[MW]',
    'graph.buy': 'Nákup',
    'graph.sell': 'Prodej',
    // format
    'format.date': 'dd.MM.yyyy',
    'format.date.moment': 'DD.MM.yyyy',
    'format.dateTime.moment': 'DD.MM.YYYY HH:mm:ss',
    'format.time.hourMinutes': 'HH:mm',
    // db layout
    'layout.grid.RDList': 'Seznam RD',
    'layout.form.RRD': 'Nový ERD',
    'layout.grid.DMOverview': 'Denní trh - přehled',
    'layout.grid.ownOrders': 'Vlastní nabídky @deliveryDate@',
    'layout.grid.bidsByDeliveryDay': 'Nabídky dle dne dodávky',
    'layout.graph.DMPosition': 'Obchodní pozice DT @deliveryDate@',
    'layout.graph.DMResults': 'Výsledky DT @deliveryDate@',
    'layout.form.order': 'Nová nabídka / Modifikace nabídky',
    // db grid
    'grid.label.docId': 'IdDok',
    'grid.label.idDgm': 'IdDgm',
    'grid.label.ver': 'Ver',
    'grid.label.anomalyReason': 'Důvod nespárování',
    'grid.label.RDVol': 'MnžRD',
    'grid.label.SSSell': 'SZ Prod',
    'grid.label.seller': 'Prodávající',
    'grid.label.buyer': 'Kupující',
    'grid.label.sender': 'Odesílatel',
    // ---
    'grid.label.session': 'Seance',
    'grid.label.deliveryDate': 'Den dodávky',
    'grid.label.deadline': 'Uzávěrka',
    'grid.label.status': 'Status',
    'grid.label.spotMarketIndex': 'SPOT MARKET INDEX (EUR/MWh)',
    'grid.label.baseLoad': 'BASE LOAD',
    'grid.label.peakLoad': 'PEAK LOAD',
    'grid.label.offPeakLoad': 'OFFPEAK LOAD',
    'grid.label.prices': 'Ceny',
    'grid.label.minPrice': 'Min cena',
    'grid.label.maxPrice': 'Max cena',
    // ---
    'grid.label.bidId': 'ID nabídky',
    'grid.label.bidVersion': 'Verze nabídky',
    'grid.label.participant': 'Účastník',
    'grid.label.type': 'Typ',
    'grid.label.category': 'Kategorie',
    'grid.label.deliveryDay': 'Den dodávky',
    'grid.label.valid': 'Platná',
    'grid.label.replaced': 'Nahrazená',
    'grid.label.cancelledForDeliveryDay': 'Anul. pro den dod.',
    'grid.label.TSCancellation': 'ČZ anulace',
    'grid.label.TSSubmission': 'ČZ zavedení',
    'grid.label.totalVolume': 'Celk. mn. [MWh]',
    'grid.label.minAcceptanceRatio': 'Min. míra sesouhl. množství',
    'grid.label.minPriceEuro': 'Min. cena [EUR/MWh]',
    'grid.label.maxPriceEuro': 'Max. cena [EUR/MWh]',
    'grid.label.parentBlockOrderId': 'Id nadřazené nabídky',
    'grid.label.exclusiveGroup': 'Výlučná skupina',
    'grid.label.settlementCurrency': 'Měna vypořádání',
    'grid.label.FSCheck': 'Okamžik FZ',
    'grid.label.systemCancellation': 'Systémová anulace',
    'grid.label.system': 'Systém',
    'grid.label.marketType': 'Typ trhu'
  }
};

export default resources;