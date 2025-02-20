import CopyField from "@/components/CopyField"
import { GenericTopBar } from "@/components/TopBars"
import Loading from "@/components/Loading"
import Login from "@/components/Login"
import { useAuth } from "@/hooks/useAuth"
import { ActionIcon, Avatar, Stack, Text } from "@mantine/core"
import { IconLogout } from "@tabler/icons-react"

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

                {user.is_anonymous && <Text c={"dimmed"}>Anonymous Account</Text>}
                {user.email && <CopyField value={user.email} />}
                <CopyField value={user.id} />

                <ActionIcon variant="default" size={"input-sm"} onClick={handleSignOut}>
                    <IconLogout />
                </ActionIcon>
            </Stack>
        </>
    )
}

export default Profile