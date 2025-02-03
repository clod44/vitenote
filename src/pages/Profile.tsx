import GenericTopBar from "@/components/GenericTopBar"
import Login from "@/components/Login"
import { ActionIcon, Avatar, Group, Stack, Text, Title } from "@mantine/core"
import { IconLogout } from "@tabler/icons-react"

const Profile = () => {



    if (false)
        return (
            <Login />
        )

    return (
        <>
            <GenericTopBar title="Profile" />
            <Stack
                align="center"
                justify="center"
                p={"md"}
                gap={"md"}
            >
                <Avatar variant="default" size={"xl"} />
                <Text ff={"monospace"} size="xl">example@gmail.com</Text>
                <ActionIcon variant="default" size={"input-sm"}>
                    <IconLogout />
                </ActionIcon>
            </Stack>
        </>
    )
}

export default Profile