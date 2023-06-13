type carInspection = {
    inspection_id: string,
    inspection_type: string,
    inspection_date: string,
    result: string,
    expired_date: string
    note: string
}

const default_inspection = [
    {
        inspection_id: "1",
        inspection_type: "Regular",
        inspection_date: "2023-04-01",
        result: "Pass",
        expired_date: "2024-04-01",
        note: "No issues found"
    },
    {
        inspection_id: "2",
        inspection_type: "Safety",
        inspection_date: "2023-03-15",
        result: "Fail",
        expired_date: "2024-03-15",
        note: "Brake system needs repair"
    },
    {
        inspection_id: "3",
        inspection_type: "Emission",
        inspection_date: "2023-02-20",
        result: "Pass",
        expired_date: "2024-02-20",
        note: "Vehicle meets emission standards"
    },
    {
        inspection_id: "4",
        inspection_type: "Regular",
        inspection_date: "2023-05-10",
        result: "Pass",
        expired_date: "2024-05-10",
        note: "No issues found"
    },
    {
        inspection_id: "5",
        inspection_type: "Safety",
        inspection_date: "2023-06-05",
        result: "Pass",
        expired_date: "2024-06-05",
        note: "Seat belts replaced"
    }
]