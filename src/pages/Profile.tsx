import GenericTopBar from "@/components/GenericTopBar"
import Loading from "@/components/Loading"
import Login from "@/components/Login"
import { useAuth } from "@/context/auth"
import { ActionIcon, Avatar, CopyButton, Stack, Text, TextInput, Tooltip } from "@mantine/core"
import { IconCheck, IconCopy, IconLogout } from "@tabler/icons-react"

const Profile = () => {
    const { user, isLoading } = useAuth();

    /* eslint-disable no-constant-condition */
    if (isLoading)
        return (
            <Loading />
        )

    if (!user)
        return (
            <Login />
        )

    console.log(user)
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
                <Text ff={"monospace"} size="xl">{user.email}</Text>
                <TextInput size="sm" placeholder="id" value={user.id} rightSection={
                    <CopyButton value={user.id} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                <ActionIcon variant="default" onClick={copy}>
                                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                } />
                <ActionIcon variant="default" size={"input-sm"}>
                    <IconLogout />
                </ActionIcon>
            </Stack>
        </>
    )
}

export default Profile