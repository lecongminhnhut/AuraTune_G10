# Catalog mapping

Source tables are the owner-supplied context-only schema. Migration 006 adds nullable explicit management ownership with no inferred backfill, independent preference/restriction and deletion marker. The stored songs.total_plays source includes retained deleted rows; unknown/negative counters fail statistics. IDs/counters cast to text inside SQL before PostgREST. No production execution occurred.

See [execution results and limits](./read-slice-results.md) and [accepted design](../preparation/accepted-design.md).
