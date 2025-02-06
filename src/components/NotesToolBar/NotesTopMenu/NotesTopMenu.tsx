import { useAuth } from "@/hooks/useAuth";
import { Menu, ActionIcon, Avatar } from "@mantine/core";
import { IconInfoCircle, IconSettings, IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";


const NotesTopMenu = () => {
    const navigate = useNavigate();
    const { user, isLoading: userLoading } = useAuth();
    const handleNavigationClick = (path: string) => {
        navigate(path);
    }

    return (

        <Menu shadow="md" width={200} withArrow position="bottom-end">
            <Menu.Target>
                <div className="relative">
                    <ActionIcon
                        size={"input-sm"}
                        variant="default"
                    >
                        <Avatar variant="transparent" radius={0} src={null} />
                    </ActionIcon>
                    {!user && !userLoading &&
                        <div className={`absolute top-1/4 w-1/2 left-1/4 h-1/2 -z-10 animate-pulse animate-duration-[2000ms]`} style={{
                            boxShadow: "0 0 3em .5em rgba(255,255,255, 1)"
                        }} />
                    }
                </div>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item
                    leftSection={<IconUser size={14} />}
                    onClick={() => handleNavigationClick("/profile")}
                >
                    {user?.email || "Not logged in"}
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