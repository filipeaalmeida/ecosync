import React, { useRef } from 'react';
import Select, { StylesConfig, SingleValue, components } from 'react-select';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  color?: string;
  icon?: React.ReactNode;
}

interface SearchableDropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value: DropdownOption | null;
  onChange: (value: DropdownOption | null) => void;
  required?: boolean;
  error?: string;
  allowEmpty?: boolean;
  emptyText?: string;
  className?: string;
  isDisabled?: boolean;
  renderOption?: (option: DropdownOption) => React.ReactNode;
  autoFocus?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  placeholder = 'Selecione...',
  options,
  value,
  onChange,
  required = false,
  error,
  allowEmpty = true,
  emptyText = 'Nenhum selecionado',
  className = '',
  isDisabled = false,
  renderOption,
  autoFocus = false
}) => {
  const selectRef = useRef<any>(null);
  
  // Adicionar opção vazia se permitido
  const allOptions = React.useMemo(() => {
    if (allowEmpty) {
      return [{ value: '', label: emptyText }, ...options];
    }
    return options;
  }, [options, allowEmpty, emptyText]);

  // Estilos customizados para combinar com Tailwind
  const customStyles: StylesConfig<DropdownOption, false> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '42px',
      backgroundColor: isDisabled ? '#f3f4f6' : 'white',
      borderColor: error ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#9ca3af'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      padding: '8px 12px',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
      }
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid #d1d5db',
      marginTop: '4px'
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '4px',
      maxHeight: '200px'
    }),
    input: (provided) => ({
      ...provided,
      color: '#374151'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '8px',
      color: '#6b7280',
      '&:hover': {
        color: '#374151'
      }
    }),
    indicatorSeparator: () => ({
      display: 'none'
    })
  };

  // Componente customizado para o dropdown indicator
  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <ChevronDown size={20} />
      </components.DropdownIndicator>
    );
  };

  // Componente customizado para renderizar opções
  const Option = (props: any) => {
    const { data } = props;
    
    if (renderOption) {
      return (
        <components.Option {...props}>
          {renderOption(data)}
        </components.Option>
      );
    }

    if (data.color || data.icon) {
      return (
        <components.Option {...props}>
          <div className="flex items-center gap-2">
            {data.icon && <span>{data.icon}</span>}
            {data.color ? (
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${data.color}`}>
                {data.label}
              </span>
            ) : (
              <span>{data.label}</span>
            )}
          </div>
        </components.Option>
      );
    }

    return <components.Option {...props} />;
  };

  // Componente customizado para o valor selecionado
  const SingleValue = (props: any) => {
    const { data } = props;
    
    if (renderOption && data.value) {
      return (
        <components.SingleValue {...props}>
          {renderOption(data)}
        </components.SingleValue>
      );
    }

    if (data.color && data.value) {
      return (
        <components.SingleValue {...props}>
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${data.color}`}>
            {data.label}
          </span>
        </components.SingleValue>
      );
    }

    return <components.SingleValue {...props} />;
  };

  // Filtro customizado que NÃO filtra pelo valor selecionado atual
  // quando o usuário abre o dropdown (searchText vazio)
  const customFilter = (option: { data: DropdownOption }, searchText: string) => {
    // Se não há texto de busca, mostrar todas as opções
    if (!searchText || searchText.trim() === '') {
      return true;
    }
    // Filtrar normalmente quando há texto de busca
    return option.data.label.toLowerCase().includes(searchText.toLowerCase());
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <Select
        ref={selectRef}
        value={value}
        onChange={(newValue: SingleValue<DropdownOption>) => onChange(newValue)}
        options={allOptions}
        styles={customStyles}
        placeholder={placeholder}
        isClearable={false}  // Sempre false para remover o X
        isSearchable={true}
        isDisabled={isDisabled}
        autoFocus={autoFocus}
        menuIsOpen={autoFocus ? true : undefined}
        components={{
          DropdownIndicator,
          Option,
          SingleValue
        }}
        filterOption={customFilter}
        blurInputOnSelect={true}
        closeMenuOnSelect={true}
        noOptionsMessage={() => 'Nenhuma opção encontrada'}
        className="react-select-container"
        classNamePrefix="react-select"
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SearchableDropdown;