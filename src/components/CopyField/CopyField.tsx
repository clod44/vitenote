import { ActionIcon, CopyButton, TextInput, Tooltip, TextInputProps } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface CopyFieldProps extends TextInputProps {
    value?: string;
}

const CopyField = ({ value = "Loading...", ...props }: CopyFieldProps) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    return (
        <TextInput
            size="sm"
            placeholder="id"
            value={displayValue}
            readOnly
            rightSection={
                <CopyButton value={value} timeout={2000}>
                    {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                            <ActionIcon variant="default" c={"dimmed"} onClick={copy}>
                                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
            }
            {...props}
        />
    );
};

export default CopyField;
