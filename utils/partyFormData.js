// utils/partyFormData.js

export const createDataCollection = () => ({
    phone: null,
    email: null,

    location: {
        id: null,
        is_district: false,
        village: null,
        street: null,
        house: null,
        flat: null,
    },

    is_legal: false,
    legal_form_id: null,
    post_type_id: null,
    bin: null,

    company_name: null,

    company_location: {
        id: null,
        is_district: false,
        village: null,
        street: null,
        building: null,
        cabinet: null,
    },

    attorney: {
        includes: false,
        type_id: null,
        num: null,
        date: null,

        person: {
            last_name: null,
            first_name: null,
            given_name: null,
            iin: null,

            data: {
                phone: null,
                email: null,

                location: {
                    id: null,
                    is_district: false,
                    village: null,
                    street: null,
                    house: null,
                    flat: null,
                },
            }
        }
    }
});