import { useMantineColorScheme, useMantineTheme } from "@mantine/core";

const BackgroundGradient = ({
    invertedColorScheme = false,
    deg = 0,
    start = 0,
    children
}: {
    invertedColorScheme?: boolean;
    deg?: number;
    start?: number;
    children?: React.ReactNode;
}) => {
    const { colorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();

    const desiredColorScheme = invertedColorScheme ? (colorScheme === "dark" ? "light" : "dark") : colorScheme;
    const bgColor = desiredColorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0];

    return (
        <div
            style={{
                background: `linear-gradient(${deg}deg, ${bgColor} ${start}%, transparent)`
            }}
        >
            {children}
        </div>
    );
};

export default BackgroundGradient;
