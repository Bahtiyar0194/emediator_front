export default defineNuxtPlugin(() => {
    const contacts = {
        url: 'emediator.kz',
        name: 'Emediator', // Не удалять
        site_name: 'Emediator.kz',
        email: 'info@emediator.kz',
        phone: '+77013814026',
        phone_format: '+7 (701) 381 4026',
        bin: '970803400548',
        postal_code: '090000',
        vat_percent: 12.00,

        founder: 'Марқаш Мейір Кенжалықызы',
        founder_short: 'Марқаш М.К.',
                
        legal_name: {
            ru: 'ИП Марқаш М.К.',
            kk: 'ЖК Марқаш М.К.'
        },

        legal_name_full: {
            ru: 'Индивидуальный предприниматель "Марқаш М.К."',
            kk: 'Жеке кәсіпкер "Марқаш М.К."'
        },

        legal_address: {
            ru: 'Республика Казахстан, Западно-Казахстанская область, г. Уральск, ул. Абиша Кекилбаева, 142',
            kk: 'Қазақстан Республикасы, Батыс Қазақстан облысы, Орал қ, Әбіш Кекілбаев көш 142',
            map_link: 'https://yandex.kz/maps/-/CLAbqGk-'
        },
        fact_address: {
            ru: 'Республика Казахстан, Западно-Казахстанская область, г. Уральск, ул. Абиша Кекилбаева, 142',
            kk: 'Қазақстан Республикасы, Батыс Қазақстан облысы, Орал қ, Әбіш Кекілбаев көш 142'
        },

        bank: {
            name: {
                ru: 'АО "Kaspi Bank"',
                kk: '"Kaspi Bank" АҚ'
            },
            bik: 'CASPKZKA',
            iik: 'KZ30722C000023118888',
            currency: {
                iso: 'KZT',
                symbol: '₸',
                name: {
                    ru: 'Теңге',
                    kk: 'Теңге'
                }
            }
        },
    }

    return {
        provide: {
            contacts
        }
    }
})
