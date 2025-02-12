import { useAuth } from "@/hooks/useAuth";
import { Menu, ActionIcon, Avatar, Indicator } from "@mantine/core";
import { IconInfoCircle, IconSettings, IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";


const NotesTopMenu = () => {
    const navigate = useNavigate();
    const { user, isLoading: userLoading } = useAuth();
    const handleNavigationClick = (path: string) => {
        navigate(path, { viewTransition: true });
    }

    const getAccountText = () => {
        if (!user) return "Not logged in";
        if (user?.is_anonymous) return "Anonymous Account";
        if (user) return user.email || "No Email";
        return "Loading...";
    };

    return (

        <Menu shadow="md" width={200} withArrow position="bottom-end">
            <Menu.Target>
                <ActionIcon
                    size={"input-sm"}
                    variant="default"
                    style={(!userLoading && !user) ? {
                        boxShadow: "0 0 1em 0em var(--mantine-color-gray-5)",
                    } : {}}
                >
                    <Avatar variant="transparent" radius={0} src={null} />
                </ActionIcon>

            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>

                <Menu.Item
                    leftSection={<IconUser size={14} />}
                    onClick={() => handleNavigationClick("/profile")}
                    style={(!userLoading && !user) ? {
                        boxShadow: "0 0 1em 0em var(--mantine-color-gray-5)",
                    } : {}}
                >
                    {getAccountText()}
                </Menu.Item>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item
                    leftSection={<IconSettings size={14} />}
                    onClick={() => handleNavigationClick("/settings")}
                >
                    Settings
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconInfoCircle size={14} />}
                    onClick={() => handleNavigationClick("/about")}
                >
                    About
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

export default NotesTopMenu