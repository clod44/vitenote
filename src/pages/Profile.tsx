import GenericTopBar from "@/components/GenericTopBar"
import Login from "@/components/Login"
import { ActionIcon, Avatar, Stack, Text } from "@mantine/core"
import { IconLogout } from "@tabler/icons-react"

const Profile = () => {


    /* eslint-disable no-constant-condition */
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