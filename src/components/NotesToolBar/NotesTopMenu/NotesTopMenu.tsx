import { useAuth } from "@/context/auth";
import { Menu, ActionIcon, Avatar } from "@mantine/core";
import { IconInfoCircle, IconSettings, IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";


const NotesTopMenu = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const handleNavigationClick = (path: string) => {
        navigate(path);
    }

    return (

        <Menu shadow="md" width={200} withArrow position="bottom-end">
            <Menu.Target>
                <ActionIcon
                    className={!user ? "animate-pulse" : ""}
                    size={"input-sm"}
                    variant="default"
                >
                    <Avatar variant="transparent" radius={0} src={null} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item
                    leftSection={<IconUser size={14} />}
                    onClick={() => handleNavigationClick("/profile")}
                >
                    Not logged in
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