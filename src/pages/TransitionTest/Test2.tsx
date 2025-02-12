import { Button, Stack } from "@mantine/core"
import { Link, useNavigate } from "react-router-dom";


const Test2 = () => {
    const navigate = useNavigate();
    return (
        <Stack w={"100%"} align="center" justify="center" gap={"md"} className="bg-blue-600 h-full">
            <h1>Test2</h1>
            <Button onClick={() => navigate("/transition-test/test1", { viewTransition: true })}>go to test1 with navigate()</Button>
            <Link to="/transition-test/test1" viewTransition>Go to Test1 with Link</Link>
        </Stack>
    )
}

export default Test2