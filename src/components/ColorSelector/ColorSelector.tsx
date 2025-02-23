import { forwardRef, useImperativeHandle, useState } from 'react';
import { Combobox, useCombobox, DEFAULT_THEME, ThemeIcon, ScrollArea, ActionIcon, ActionIconProps } from '@mantine/core';

const colors = Object.keys(DEFAULT_THEME.colors);

export interface ColorSelectorRef {
    setValue: (color: string) => void
    value: () => string
}

const ColorSelector = forwardRef(({
    onChange = () => { },
    defaultValue = "gray",
    ...props
}: {
    onChange?: (color: string) => void
    defaultValue?: string
} & ActionIconProps, ref) => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [value, setValue] = useState<string>(defaultValue);

    const options = colors.map((color) => (
        <Combobox.Option value={color} key={color}>
            <ThemeIcon size="xs" radius="xl" color={color} />
        </Combobox.Option>
    ));

    useImperativeHandle(ref, () => ({
        setValue: (color: string) => {
            if (colors.includes(color)) {
                setValue(color);
            } else {
                setValue("gray");
                console.warn(`Color ${color} not found. Using default instead`);
            }
        },
        value: () => value
    }));

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
                setValue(val);
                onChange(val);
                combobox.closeDropdown();
            }}
            width={50}
            withArrow
        >
            <Combobox.Target>
                <ActionIcon variant="default" onClick={() => combobox.toggleDropdown()} {...props}>
                    <ThemeIcon size="xs" radius="xl" color={value} />
                </ActionIcon>
            </Combobox.Target>

            <Combobox.Dropdown>
                <ScrollArea.Autosize type="scroll" mah={200} scrollbars="y">
                    <Combobox.Options>{options}</Combobox.Options>
                </ScrollArea.Autosize>
            </Combobox.Dropdown>
        </Combobox>
    );
})

export default ColorSelector