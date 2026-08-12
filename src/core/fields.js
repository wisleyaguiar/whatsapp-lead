export const FIELD_DEFINITIONS = {
  cnpj: {
    label: 'CNPJ',
    payloadKey: 'cnpj',
    errorMessage: 'Informe o CNPJ.'
  },
  razaoSocial: {
    label: 'Razão Social',
    payloadKey: 'razao_social',
    errorMessage: 'Informe a razão social.'
  },
  email: {
    label: 'E-mail',
    payloadKey: 'email',
    errorMessage: 'Informe um e-mail válido.'
  }
};

export function resolveFields(fieldsConfig = []) {
  return fieldsConfig
    .map((entry) => {
      const required = entry.startsWith('*');
      const id = required ? entry.slice(1) : entry;
      return { id, required };
    })
    .filter((field) => Object.prototype.hasOwnProperty.call(FIELD_DEFINITIONS, field.id));
}
