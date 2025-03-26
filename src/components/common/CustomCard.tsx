// src/components/common/CustomCard.tsx
import { Card, CardContent, CardProps, Typography } from "@mui/material";

interface CustomCardProps extends CardProps {
  title: string;
  children: React.ReactNode;
}

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  children,
  ...props
}) => {
  return (
    <Card
      {...props}
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        bgcolor: "background.paper",
        color: "text.primary",
        ...props.sx,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

export default CustomCard;
