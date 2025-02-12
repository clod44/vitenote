import { Button, Stack } from "@mantine/core"
import { Link, useNavigate } from "react-router-dom";


const Test1 = () => {
    const navigate = useNavigate();
    return (
        <Stack w={"100%"} align="center" justify="center" gap={"md"} className="bg-white h-full">
            <h1>Test1</h1>
            <Button onClick={() => navigate("/transition-test/test2", { viewTransition: true })}>go to test2 with navigate()</Button>
            <Link to="/transition-test/test2" viewTransition>Go to Test2 with Link</Link>
        </Stack>
    )
}

export default Test1