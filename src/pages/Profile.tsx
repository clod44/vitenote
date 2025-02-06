import GenericTopBar from "@/components/GenericTopBar"
import Loading from "@/components/Loading"
import Login from "@/components/Login"
import { useAuth } from "@/hooks/useAuth"
import { ActionIcon, Avatar, CopyButton, Stack, TextInput, Tooltip } from "@mantine/core"
import { IconCheck, IconCopy, IconLogout } from "@tabler/icons-react"

const Profile = () => {
    const { user, isLoading, signOut } = useAuth();

    const handleSignOut = async () => {
        //TODO: add confirmation
        await signOut();
    }
    if (isLoading)
        return (
            <Loading />
        )

    if (!user)
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
                <Avatar variant="default" size={"xl"} style={{
                    boxShadow: "0 0 15em rgba(255,255,255, 1)"
                }} />
                <TextInput size="sm" placeholder="id" defaultValue={user.email} readOnly rightSection={
                    <CopyButton value={user.email} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                <ActionIcon variant="default" c={"dimmed"} onClick={copy}>
                                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                } />
                <TextInput size="sm" placeholder="id" defaultValue={user.id} readOnly rightSection={
                    <CopyButton value={user.id} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                <ActionIcon variant="default" c={"dimmed"} onClick={copy}>
                                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                } />
                <ActionIcon variant="default" size={"input-sm"} onClick={handleSignOut}>
                    <IconLogout />
                </ActionIcon>
            </Stack>
        </>
    )
}

export default Profile