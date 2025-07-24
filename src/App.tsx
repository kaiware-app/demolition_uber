import {
  Add,
  AddCircle,
  Calculate,
  DeliveryDining,
  Paid,
} from "@mui/icons-material";
import {
  Button,
  Card,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import "./App.css";

type Delivery = {
  reward?: number;
  deliveryCount?: number;
  cancelCount?: number;
  minutes?: number;
};

function App() {
  const initDelivery: Delivery = {
    reward: undefined,
    deliveryCount: 2,
    cancelCount: 1,
    minutes: 0,
  };

  const [original, setOriginal] = useState<Delivery>(initDelivery);
  const [addDeliveries, setAddDeliveries] = useState<Delivery[]>([]);
  const [finalyMinutes, setFinalyMinutes] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  /** 報酬額を計算する */
  const calcReward = () => {
    console.log(original);
    console.log(finalyMinutes);
    if (
      !original.reward ||
      !original.cancelCount ||
      !original.minutes ||
      !original.deliveryCount ||
      !finalyMinutes
    ) {
      window.alert("入力されていない項目があります。");
      return;
    }

    const adjustedOriginalReward =
      (original.reward / original.deliveryCount) *
      (original.deliveryCount - original.cancelCount);

    const timeAward =
      (adjustedOriginalReward / original.minutes) * finalyMinutes;

    const addDeliveryReward = addDeliveries.reduce(
      (acc, current) => (current.reward ? (acc += current.reward) : (acc += 0)),
      0
    );

    console.log(adjustedOriginalReward + timeAward + addDeliveryReward);

    console.log(
      `${adjustedOriginalReward} + ${timeAward} + ${addDeliveryReward}`
    );
    setResult(adjustedOriginalReward + timeAward + addDeliveryReward);
    setOpenModal(true);
  };

  const setAddDelivery = (
    key: "reward" | "deliveryCount" | "cancelCount" | "minutes",
    index: number,
    value: number
  ) => {
    const temp = [...addDeliveries];
    temp[index][key] = value;
  };

  return (
    <>
      <Typography level="h3" startDecorator={<Paid />}>
        解体+追い 報酬計算機
      </Typography>

      <Card style={{ marginBottom: "15px" }}>
        <Typography level="title-lg" startDecorator={<DeliveryDining />}>
          最初の案件情報
        </Typography>
        <FormControl>
          <FormLabel>受託金額 (解体前) / 円</FormLabel>
          <Input
            size="lg"
            type="number"
            placeholder="3200"
            variant="outlined"
            onChange={(e) =>
              setOriginal((prev) => ({
                ...prev,
                reward: Number(e.target.value),
              }))
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>見積り時間 / 分</FormLabel>
          <Input
            size="lg"
            type="number"
            placeholder="32"
            variant="outlined"
            onChange={(e) =>
              setOriginal((prev) => ({
                ...prev,
                minutes: Number(e.target.value),
              }))
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>受託時 (解体前) の配達件数</FormLabel>
          <Select
            size="lg"
            defaultValue={2}
            onChange={(_, value) =>
              setOriginal((prev) => ({
                ...prev,
                deliveryCount: Number(value),
              }))
            }
          >
            <Option value={2}>2件 (ダブル)</Option>
            <Option value={3}>3件 (トリプル)</Option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>受託時の案件のうち、解体した件数</FormLabel>
          <Select
            size="lg"
            defaultValue={1}
            onChange={(_, value) =>
              setOriginal((prev) => ({
                ...prev,
                cancelCount: Number(value),
              }))
            }
          >
            <Option value={1}>1件</Option>
            <Option value={2}>2件</Option>
          </Select>
        </FormControl>
      </Card>

      <Card style={{ marginBottom: "15px" }}>
        <Typography level="title-lg" startDecorator={<AddCircle />}>
          追いの案件情報
        </Typography>

        <div>
          {(addDeliveries ?? []).map((_, i) => {
            return (
              <Card sx={{ marginBottom: "10px" }}>
                <Typography
                  level="title-lg"
                  startDecorator={<DeliveryDining />}
                >
                  案件情報 追い {i + 1}
                </Typography>

                <FormControl>
                  <FormLabel>受託金額 / 円</FormLabel>
                  <Input
                    size="lg"
                    type="number"
                    placeholder="500"
                    variant="outlined"
                    onChange={(e) =>
                      setAddDelivery("reward", i, Number(e.target.value))
                    }
                  />
                </FormControl>

                {/* <FormControl>
                  <FormLabel>見積り時間 / 分</FormLabel>
                  <Input
                    size="lg"
                    type="number"
                    placeholder="12"
                    variant="outlined"
                    onChange={(e) =>
                      setAddDelivery("minutes", i, Number(e.target.value))
                    }
                  />
                </FormControl> */}

                <FormControl>
                  <FormLabel>配達件数</FormLabel>
                  <Select
                    size="lg"
                    defaultValue={1}
                    onChange={(_, value) =>
                      setAddDelivery("deliveryCount", i, value ?? 1)
                    }
                  >
                    <Option value={1}>1件</Option>
                    <Option value={2}>2件</Option>
                  </Select>
                </FormControl>
              </Card>
            );
          })}
        </div>

        <Button
          color="primary"
          disabled={false}
          loading={false}
          onClick={() => {
            setAddDeliveries((prev) => [
              ...prev,
              { ...initDelivery, deliveryCount: 1, cancelCount: 0 },
            ]);
          }}
          size="lg"
          variant="soft"
          startDecorator={<Add />}
          sx={{ maxWidth: "120px" }}
        >
          追加
        </Button>
      </Card>

      <Card style={{ marginBottom: "15px" }}>
        <Typography level="title-lg" startDecorator={<DeliveryDining />}>
          最終的な案件情報
        </Typography>

        <FormControl>
          <FormLabel>実際にかかった時間 / 分</FormLabel>
          <Input
            size="lg"
            type="number"
            placeholder="32"
            variant="outlined"
            onChange={(e) => setFinalyMinutes(Number(e.target.value))}
          />
        </FormControl>
      </Card>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          color="primary"
          disabled={false}
          loading={false}
          onClick={calcReward}
          size="lg"
          variant="soft"
          startDecorator={<Calculate />}
          sx={{ maxWidth: "200px" }}
        >
          計算する
        </Button>
      </div>
      {
        <Modal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
        >
          <ModalDialog color="neutral" layout="center" size="lg" variant="soft">
            <ModalClose />
            <DialogTitle>報酬見積り</DialogTitle>
            <DialogContent>
              <Typography color="danger" level="h3" variant="plain">
                {`${Math.round(result!)}円 ±10%`}
              </Typography>
              <p
                style={{ margin: "0px 0px 5px 0px", padding: "2px" }}
              >{`-10%: ${Math.round(result! - result! * 0.1)}円`}</p>
              <p
                style={{ margin: "0px 0px 5px 0px", padding: "2px" }}
              >{`+10%: ${Math.round(result! + result! * 0.1)}円`}</p>
            </DialogContent>
          </ModalDialog>
        </Modal>
      }
    </>
  );
}

export default App;
