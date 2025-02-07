import GenericTopBar from "@/components/GenericTopBar"
import { Stack, Switch, useMantineColorScheme } from "@mantine/core"
import { IconMoonStars, IconSun } from "@tabler/icons-react"

const Settings = () => {
    const { setColorScheme, colorScheme } = useMantineColorScheme({
        keepTransitions: true,
    });
    return (
        <>
            <GenericTopBar title="Settings" />
            <Stack w={"100%"} align="center" gap={"md"} p={"md"}>
                <Switch
                    size="xl"
                    color="dark.4"
                    checked={colorScheme === 'dark'}
                    onChange={(event) => setColorScheme(event.currentTarget.checked ? 'dark' : 'light')}
                    onLabel={<IconSun size={16} stroke={2.5} />}
                    offLabel={<IconMoonStars size={16} stroke={2.5} />}
                />
            </Stack>
        </>
    )
}

export default Settings