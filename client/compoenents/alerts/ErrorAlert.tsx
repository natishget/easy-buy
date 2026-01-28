import React from "react";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";

const ErrorAlert = ({ alertName = "", description = "" }) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <button className="mt-3 py-3 w-full bg-[rgb(56,177,151)] text-white font-bold rounded-xl">
          Add to Cart
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{alertName}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {description}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default ErrorAlert;
