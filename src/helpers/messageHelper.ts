const deleteReply = (interaction: any, timeBeforeDeletion: number) => {
  setTimeout(async () => {
    await interaction.deleteReply();
  }, timeBeforeDeletion);
};

export { deleteReply };
