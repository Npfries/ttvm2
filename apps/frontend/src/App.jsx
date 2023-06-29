import { AppShell, Navbar, Header, Button, Text } from "@mantine/core";
import { List, ThemeIcon } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import MonacoEditor from "@uiw/react-monacoeditor";
import "./App.css";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);

  const [socket, setSocket] = useState(null);

  const listener = (message) => {
    console.log("message: ", message);
    setMessages((prev) => [...prev, message]);
  };

  useEffect(() => {
    const newSocket = io(`http://localhost:3003`);
    setSocket(newSocket);
    newSocket.on("test", listener);
    return () => {
      newSocket.close();
      newSocket.off("test", listener);
    };
  }, [setSocket]);

  const submit = async () => {
    const result = await fetch(`http://localhost:3003`, {
      method: "POST",
      body: value,
    });
    console.log(result);
  };

  const onChange = (value) => {
    setValue(value);
  };

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} height={500} p="xs">
          <Button onClick={submit}>Run</Button>
          <List
            m="lg"
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCircleCheck size="1rem" />
              </ThemeIcon>
            }
          >
            {messages.map((m, i) => (
              <List.Item key={i}>Result: {m}</List.Item>
            ))}
          </List>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <Text order={2}>TTCode</Text>
          {socket ? <div>Connected</div> : <div>Not Connected</div>}
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <MonacoEditor
        language="javascript"
        value="function sayHello(name) {
    return `Hi, ${name}!`
}
      
sayHello('User')"
        options={{
          theme: "vs",
        }}
        onChange={onChange}
      />
    </AppShell>
  );
}

export default App;
