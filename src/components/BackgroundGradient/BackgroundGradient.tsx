import { useMantineColorScheme, useMantineTheme } from "@mantine/core";

const BackgroundGradient = ({
    invertedColorScheme = false,
    darkShade = 7,
    lightShade = 0,
    deg = 0,
    start = 0,
    children,
}: {
    invertedColorScheme?: boolean;
    darkShade?: number;
    lightShade?: number;
    deg?: number;
    start?: number;
    children?: React.ReactNode;
}) => {
    const { colorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();

    const desiredColorScheme = invertedColorScheme ? (colorScheme === "dark" ? "light" : "dark") : colorScheme;
    const bgColor = desiredColorScheme === "dark" ? theme.colors.dark[darkShade] : theme.colors.gray[lightShade];

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
