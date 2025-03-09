import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface SearchInputProps {
     search: string;
     onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ search, onSearchChange }: SearchInputProps) => {
     return (
          <TextInput
               placeholder="Search by any field"
               mb="md"
               leftSection={<IconSearch size={16} stroke={1.5} />}
               value={search}
               onChange={onSearchChange}
          />
     );
};

export default SearchInput;
