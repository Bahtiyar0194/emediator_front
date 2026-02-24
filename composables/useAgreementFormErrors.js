export function useAgreementFormErrors(errorsRef, prefix = '') {
  const getError = (field) => {
    const key = prefix ? `${prefix}.${field}` : field;
    return errorsRef.value?.[key]?.[0] || null;
  };

  return { getError };
}